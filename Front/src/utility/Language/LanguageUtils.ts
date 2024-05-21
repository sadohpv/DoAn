import messages_vi from "../../translations/vi.json";
import messages_en from "../../translations/en.json";

const flattenMessages = (nestedMessages: any, prefix = "") => {
  if (nestedMessages == null) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};

const messages: Record<string, Record<string, string>> = {
  vi: flattenMessages(messages_vi),
  en: flattenMessages(messages_en),
};

// console.log(messages);
export default class LanguageUtils {
  static getMessageByKey(key: string, lang: string) {
    return messages[lang][key];
  }

  static getFlattenedMessages() {
    return messages;
  }
}
