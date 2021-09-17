const unstable_shouldOnCreateNode = ({node}) => {
    return node.internal.mediaType === 'application/json';
}

exports.unstable_shouldOnCreateNode = unstable_shouldOnCreateNode

exports.onCreateNode = async (
    {
        node,
        actions,
        loadNodeContent,
        createNodeId,
        createContentDigest,
        reporter
    }
) => {
    if (!unstable_shouldOnCreateNode({node})) {
        return;
    }

    const {
        absolutePath,
        internal: {mediaType, type},
        sourceInstanceName,
        relativeDirectory,
        name,
        id
    } = node;

    if (type !== 'File' || sourceInstanceName !== 'locales') {
        return;
    }

    const activity = reporter.activityTimer(
        `gatsby-plugin-i18next: create node: ${relativeDirectory}/${name}`
    );

    activity.start();

    const language = relativeDirectory;
    const content = await loadNodeContent(node);

    let data;
    try {
        data = JSON.stringify(JSON.parse(content), undefined, '');
    } catch {
        const hint = node.absolutePath
            ? `file ${node.absolutePath}`
            : `in node ${node.id}`
        throw new Error(`Unable to parse JSON: ${hint}`)
    }

    const {createNode, createParentChildLink} = actions;

    const localeNode = {
        id: createNodeId(`${id} >>> Locale`),
        children: [],
        parent: id,
        internal: {
            content: data,
            contentDigest: createContentDigest(data),
            type: `Locale`
        },
        language,
        ns: name,
        data,
        fileAbsolutePath: absolutePath
    };

    createNode(localeNode);

    createParentChildLink({parent: node, child: localeNode});

    activity.end();
};

/**
 *
 * @param {string} dirPath
 * @param {string[]} langs
 * @param {string} fallbackLang
 * @return {{ locale: string, path: string}} locale with prefix slash
 */
const parseDir = (dirPath, langs, fallbackLang) => {
    const dir = dirPath.startsWith('/') ? dirPath.substring(1) : dirPath;
    const fstIdx = dir.indexOf('/')
    const locale = fstIdx === -1 ? dir : dir.substring(0, fstIdx)

    if (langs.includes(locale)) {
        return {
            locale,
            path: fstIdx === -1 ? '/' : dir.substring(fstIdx)
        }
    } else {
        return {
            locale: fallbackLang,
            path: '/' + dir
        }
    }
}

const cache = new Map()
let info = new Map()
const LGS = 'langs'
const FBL = 'fallbackLang'

exports.onCreatePage = (
    {page, actions, getNodesByType},
    lngOption
) => {
    if (page.context.i18n) {
        return
    }

    // just run in first time
    if (cache.size === 0) {
        if (!lngOption.docName) {
            console.error('docName is undefined')
        }

        info.set(LGS, Object.keys(lngOption.supportedLngs))
        info.set(FBL, lngOption.i18n.fallbackLng)

        getNodesByType('File').forEach((v) => {
            if (v.sourceInstanceName === lngOption.docName) {
                const {path, locale} = parseDir(v.relativeDirectory, info.get(LGS), info.get(FBL))
                const file = (path.endsWith('/') ? '' : path) + '/' + v.name

                if (cache.has(file)) {
                    cache.get(file).push(locale)
                } else {
                    cache.set(file, [locale])
                }
            }
        })
    }

    // get page supported languages
    const {locale, path} = parseDir(page.path, info.get(LGS), info.get(FBL))
    const langs = cache.get(path.endsWith('/') ? (path + 'index') : path)

    if (langs?.length > 0 || page.isCreatedByStatefulCreatePages) {
        const {createPage, deletePage} = actions
        const lang = langs?.find((v) => v === locale) || info.get(FBL)
        deletePage(page)
        createPage({
            ...page,
            context: {
                ...page.context,
                i18n: {
                    isFallback: langs === info.get(FBL),
                    fallbackLng: info.get(FBL),
                    lng: lang,
                    lngs: langs || info.get(LGS)
                }
            }
        })
    }
}


