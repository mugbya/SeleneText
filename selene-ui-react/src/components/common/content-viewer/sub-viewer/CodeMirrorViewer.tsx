import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function CodeMirrorViewer({
                                           code,
                                           language,
                                           editable,
                                           onChange,
                                         }: {
  code: string;
  language: string;
  editable: boolean;
  onChange: (newCode: string) => void;
}) {
  const extensions = language === 'javascript' ? [javascript()] : [];
  // console.log("CodeMirrorViewer code", code);

  return (
      <CodeMirror
          className="text-left"  // Tailwind 用户
          value={code}
          height="100%"
          // height="30rem" // 每行大约 1rem 高
          // basicSetup={{
          //   lineNumbers: true,
          //   highlightActiveLine: true,
          // }}
          basicSetup={true} // 或直接设为 true 使用默认配置
          editable={editable}
          extensions={extensions}
          onChange={(value) => onChange(value)}
      />
  );
}