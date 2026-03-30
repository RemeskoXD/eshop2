declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      alt?: string;
      poster?: string;
      ar?: boolean;
      "ar-modes"?: string;
      "camera-controls"?: boolean;
      "auto-rotate"?: boolean;
      exposure?: string;
      "shadow-intensity"?: string;
      "ios-src"?: string;
      style?: React.CSSProperties;
    };
  }
}
