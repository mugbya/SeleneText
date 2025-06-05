type FileNode = {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileNode[];
};

export default function FileTree({ nodes }: { nodes: FileNode[] }) {
    return (
        <ul>
            {nodes.map((node) => (
                <li key={node.path}>
                    {node.isDirectory ? '📁' : '📄'} {node.name}
                    {node.children && <FileTree nodes={node.children} />}
                </li>
            ))}
        </ul>
    );
}