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


