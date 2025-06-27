
interface Window {
  adsbygoogle?: any[];
  googleTranslateElementInit: () => void;
  google?: {
    translate?: {
      TranslateElement?: {
        new (options: {
          pageLanguage: string;
          includedLanguages: string;
          layout: any;
          autoDisplay: boolean;
        }, elementId: string): any;
        InlineLayout?: {
          HORIZONTAL: number;
          SIMPLE: number;
          VERTICAL: number;
        };
      };
    };
  };
}
