// import Editor from "@monaco-editor/react";
//
// export default function CodeMonacoEditor({
//   code,
//   language,
//   editable,
//   onChange,
// }: {
//   code: string;
//   language: string;
//   editable: boolean;
//   onChange: (newCode: string) => void;
// }) {
//   return (
//     <Editor
//       height="400px"
//       defaultLanguage={language}
//       defaultValue={code}
//       onChange={(value) => onChange(value || "")}
//       options={{
//         readOnly: !editable,
//         minimap: { enabled: false },
//         fontSize: 14,
//       }}
//     />
//   );
// }