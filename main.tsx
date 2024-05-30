import "./styles.css";
import React from "react";

interface Metadata {
  name: string;
  moreData?: object; // Optional since it was declared as object
}

interface Buffer {
  isActive: boolean;
  file: File;
}

interface File {
  content: string;
  metadata: Metadata;
}

interface Folder {
  metadata: Metadata;
  subFolders: Folder[];
  files: File[];
}

// Function to simulate opening a file in an editor
function openFileInEditor() {
  alert("Opening file in editor...");
}

const Directory: React.FC<{
  dir: Folder;
  openFileInEditor: (file: File) => void;
}> = ({ dir, openFileInEditor }) => {
  const [isToggled, setIsToggled] = React.useState(false);

  function renderFile(file: File) {
    return (
      <div
        onClick={() => {
          openFileInEditor(file);
        }}
        key={file.metadata.name}
        style={{ padding: "5px", cursor: "pointer", color: "blue" }}
      >
        {file.metadata.name}
      </div>
    );
  }

  function renderDir(dir: Folder) {
    return (
      <div key={dir.metadata.name} style={{ marginLeft: "20px" }}>
        {dir.subFolders.length > 0 && (
          <div>
            <div>
              <div
                onClick={() => {
                  setIsToggled((prevState) => !prevState);
                }}
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: isToggled ? "green" : "black",
                }}
              >
                {dir.metadata.name}
              </div>
            </div>
            {isToggled &&
              dir.subFolders.map((folder) => (
                <Directory
                  dir={folder}
                  openFileInEditor={openFileInEditor}
                  key={folder.metadata.name}
                />
              ))}
          </div>
        )}
        {dir.files.length > 0 && isToggled && (
          <div>{dir.files.map((file) => renderFile(file))}</div>
        )}
      </div>
    );
  }

  return <div>{renderDir(dir)}</div>;
};

const EditorContainer: React.FC<{}> = ({}) => {
  const [activeBuffers, setActiveBuffers] = React.useState<Buffer[]>([]);

  const dir: Folder = {
    metadata: {
      name: "Root Folder",
    },
    subFolders: [
      {
        metadata: {
          name: "SubFolder 1",
        },
        subFolders: [],
        files: [
          {
            content: "Document 1",
            metadata: {
              name: "Document 1",
            },
          },
        ],
      },
      {
        metadata: {
          name: "SubFolder 2",
        },
        subFolders: [
          {
            metadata: {
              name: "Nested SubFolder",
            },
            subFolders: [],
            files: [
              {
                content: "Report 1",
                metadata: {
                  name: "Report 1",
                },
              },
            ],
          },
        ],
        files: [
          {
            content: "Document 2",
            metadata: {
              name: "Document 2",
            },
          },
        ],
      },
    ],
    files: [
      {
        content: "Main Document",
        metadata: {
          name: "Main Document",
        },
      },
    ],
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <Directory
        dir={dir}
        openFileInEditor={(file: File) => {
          setActiveBuffers((prev) => {
            // Check if the buffer already exists
            if (
              prev.find(
                (buffer) => buffer.file.metadata.name === file.metadata.name
              )
            ) {
              return prev;
            }
            return [...prev, { isActive: true, file }];
          });
        }}
      />
      <Editor buffers={activeBuffers} />
    </div>
  );
};

const BufferContainer: React.FC<{
  buffer: Buffer;
  onBufferClicked: () => void;
  onBufferClosed: () => void;
}> = ({ buffer, onBufferClicked, onBufferClosed }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
        borderBottom: "1px solid grey",
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => {
          onBufferClicked();
        }}
      >
        {buffer.file.metadata.name}
      </div>
      <div
        onClick={() => {
          onBufferClosed();
        }}
        style={{ color: "red", cursor: "pointer" }}
      >
        X
      </div>
    </div>
  );
};

const BufferNavbar: React.FC<{
  buffers: Buffer[];
  setActiveBuffer: (name: string) => void;
  closeBuffer: (name: string) => void;
}> = ({ buffers, setActiveBuffer, closeBuffer }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid black",
        marginBottom: "10px",
      }}
    >
      {buffers.map((buffer, index) => (
        <BufferContainer
          key={index}
          buffer={buffer}
          onBufferClicked={() => setActiveBuffer(buffer.file.metadata.name)}
          onBufferClosed={() => closeBuffer(buffer.file.metadata.name)}
        />
      ))}
    </div>
  );
};

const FileEditor: React.FC<{ file: File | null }> = ({ file }) => {
  if (file === null) {
    return <div>No files opened</div>;
  }
  return (
    <div style={{ padding: "10px", background: "#f9f9f9" }}>{file.content}</div>
  );
};

const Editor: React.FC<{ buffers: Buffer[] }> = ({ buffers }) => {
  const [currentBufferName, setCurrentBufferName] = React.useState<
    string | null
  >(null);

  const currentBuffer = currentBufferName
    ? buffers.find((buffer) => buffer.file.metadata.name === currentBufferName)
    : null;

  const closeBuffer = (name: string) => {
    setCurrentBufferName((prev) => (prev === name ? null : prev));
  };

  const setActiveBuffer = (name: string) => {
    setCurrentBufferName(name);
  };

  if (buffers.length < 1) {
    return <div>No open files</div>;
  }

  return (
    <div>
      <BufferNavbar
        buffers={buffers}
        setActiveBuffer={setActiveBuffer}
        closeBuffer={closeBuffer}
      />
      <FileEditor file={currentBuffer ? currentBuffer.file : null} />
    </div>
  );
};

export default function App() {
  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Hello CodeSandbox</h1>
      <h2 style={{ textAlign: "center" }}>
        Explore the file system structure below:
      </h2>
      <EditorContainer />
    </div>
  );
}
