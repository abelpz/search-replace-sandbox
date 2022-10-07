import reactStringReplace from "react-string-replace";
import { stripHtml } from "string-strip-html";

function replace({
  baseText,
  searchText,
  replaceText = "",
  options = {},
  replaceIndexes,
}) {
  const _options = {
    beforeMatch: "",
    afterMatch: "",
    beforeReplace: "",
    afterReplace: "",
    ...options,
  };

  let index = -1;

  const replacedText = reactStringReplace(baseText, searchText, (match) => {
    index++;
    if (!replaceIndexes) return match;
    if (
      replaceIndexes === "all" ||
      replaceIndexes === index ||
      (Array.isArray(replaceIndexes) && replaceIndexes.includes(index))
    )
      return replaceText;
    return match;
  }).join("");

  const occurrencesSource = reactStringReplace(
    replacedText,
    searchText,
    (match, i) => {
      if (replaceText) {
        return stripHtml(
          `${_options.beforeMatch}${match}${_options.afterMatch}${_options.beforeReplace}${replaceText}${_options.afterReplace}`
        ).result;
      } else {
        return stripHtml(
          `${_options.beforeMatch}${match}${_options.afterMatch}`
        ).result;
      }
    }
  );
  function getOccurrences(occurrencesSource) {
    const references = [];
    for (let i = 0; i < occurrencesSource.length; i += 2) {
      if (occurrencesSource[i + 1]) {
        const element =
          occurrencesSource[i + 0]?.slice(-10) +
          occurrencesSource[i + 1] +
          occurrencesSource[i + 2]?.slice(0, 10);
        references.push({ reference: element });
      }
    }
    return references;
  }
  return { replacedText, occurrences: getOccurrences(occurrencesSource) };
}

export default replace;
