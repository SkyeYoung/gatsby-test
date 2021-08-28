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

const cache = new Map()

const lastEle = (arr) => arr[arr.length - 1]

exports.onCreatePage = (
    {page, actions, getNodesByType},
    lngOption
) => {
    if (page.context.i18n) {
        return
    }

    const {createPage, deletePage, createRedirect} = actions
    const originPath = page.path
    const originPathArr = originPath.split('/')
    const name = lastEle(originPathArr)

    if (cache.size === 0) {
        const lngs = Object.keys(lngOption.supportedLngs)
        if (!lngOption.docName) {
            console.error('docName is undefined')
        }
        getNodesByType('File').forEach((v) => {
            if (v.sourceInstanceName === lngOption.docName) {
                const locale = v.relativeDirectory.split('/')[0]
                const lng = lngs.includes(locale) ? locale : lngOption.i18n.fallbackLng
                if (cache.has(v.name)) cache.get(v.name).push(lng)
                else cache.set(v.name, [lng])
            }
        })
    }

    const lngs = cache.get(originPath === '/' ? 'index' : name)
    if (lngs?.length > 0) {
        const lng = lngs.find((v) => v === originPathArr[1]) || lngOption.i18n.fallbackLng
        deletePage(page)
        createPage({
            ...page,
            context: {
                ...page.context,
                i18n: {
                    isFallback: lng === lngOption.i18n.fallbackLng,
                    fallbackLng: lngOption.i18n.fallbackLng,
                    lng,
                    lngs
                }
            }
        })
    }
}


