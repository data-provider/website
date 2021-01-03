import { useAllDocsData, useActivePluginAndVersion } from "@theme/hooks/useDocs";
import { useDocsPreferredVersionByPluginId, DEFAULT_SEARCH_TAG } from "@docusaurus/theme-common";

// Overwrite original hook because contextualSearch is not working
// It maybe does not work because the site was created with docusaurus v1, and the Algolia search was created without
// docusaurus tags. Maybe it could be fixed adding search facets to docssearch algolia config.
// https://www.algolia.com/doc/api-reference/api-parameters/facets/
// https://github.com/algolia/docsearch-configs/blob/master/configs/data-provider.json
// Remove this workaround after updating Algolia config

function useContextualSearchFilters() {
  const allDocsData = useAllDocsData();
  const activePluginAndVersion = useActivePluginAndVersion();
  const docsPreferredVersionByPluginId = useDocsPreferredVersionByPluginId();

  function getDocPluginTags(pluginId) {
    const activeVersion =
      activePluginAndVersion?.activePlugin?.pluginId === pluginId
        ? activePluginAndVersion.activeVersion
        : undefined;

    const preferredVersion = docsPreferredVersionByPluginId[pluginId];

    const latestVersion = allDocsData[pluginId].versions.find((v) => v.isLast);

    const version = activeVersion ?? preferredVersion ?? latestVersion;

    return version.name;
  }

  return [DEFAULT_SEARCH_TAG, ...Object.keys(allDocsData).map(getDocPluginTags)];
}

export default function useAlgoliaContextualFacetFilters() {
  const searchFilters = useContextualSearchFilters();

  return [searchFilters.map((tag) => `version:${tag}`)];
}
