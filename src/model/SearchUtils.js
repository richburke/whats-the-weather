
class SearchUtils {

  static escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  static getMatches(src, value) {
    const escapedValue = SearchUtils.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');
    return src.filter(item => regex.test(item.name));
  }

  static hasMatch(src, value) {
    const escapedValue = SearchUtils.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');
    const matches = src.filter(item => regex.test(item.name));

    return matches.length === 1 && SearchUtils.escapeRegexCharacters(matches[0].name.trim().toLowerCase()) === escapedValue.toLowerCase();
  }
}

export default SearchUtils;
