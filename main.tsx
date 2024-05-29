import "./styles.css";

interface Metadata {
  name: string;
  moreData?: object; // Optional since it was declared as object
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

const Directory: React.FC<{ dir: Folder; openFileInEditor: () => void }> = ({
  dir,
  openFileInEditor,
}) => {
  const [isToggled, setIsToggled] = React.useState(false);

  function renderFile(file: File) {
    return (
      <div
        onClick={() => {
          openFileInEditor(file);
        }}
      >
        {file.metadata.name}
      </div>
    );
  }

  function renderDir(dir: Folder) {
    return (
      <div>
        {dir.subFolders.length > 0 && (
          <div>
            <div>
              {" "}
              <div
                onClick={() => {
                  setIsToggled((prevState) => {
                    return !prevState;
                  });
                }}
              >
                {dir.metadata.name}{" "}
              </div>
            </div>
            {isToggled &&
              dir.subFolders.map((folder) => {
                return (
                  <Directory
                    dir={folder}
                    openFileInEditor={() => {
                      openFileInEditor;
                    }}
                  />
                ); // Recursively render subfolders
              })}
          </div>
        )}
        {dir.files.length > 0 && isToggled && (
          <div>
            {dir.files.map((file) => {
              return renderFile(file); // Render files
            })}
          </div>
        )}
      </div>
    );
  }

  return <div>{renderDir(dir)}</div>;
};

const EditorContainer: React.FC = () => {
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
  const [buffers, setBuffers] = React.useState<Buffer[]>([]);
  return (
    <div>
      <Directory
        dir={dir}
        openFileInEditor={openFileInEditor}
        openFileInEditor={(file) => {
          setBuffers((prev) => {
            const new_arr = [...prev];
            new_arr.push(file);
            return new_arr;
          });
        }}
      />
      <FileDisplayer buffers={buffers} />
    </div>
  );
};

interface Buffer {
  isActive: boolean;
  file: File;
}

const BufferContainer: React.FC<{
  buffer: Buffer;
  onBufferClicked: () => void;
  onBufferClosed: () => void;
}> = ({ buffer, onBufferClicked, onBufferClosed }) => {
  return (
    <div>
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
      >
        X
      </div>
    </div>
  );
};
const BufferNavbar: React.FC<{ buffers: Buffer[] }> = ({ buffers }) => {
  return (
    <div>
      {buffers.map((buffer) => {
        return (
          <Buffer
            buffer={buffer}
            onBufferClicked={() => {}}
            onBufferClosed={() => {}}
          />
        );
      })}
    </div>
  );
};

const FileEditor: React.FC<{ file: File }> = ({ file }) => {
  return <div>hi</div>;
};

const FileDisplayer: React.FC<{ buffers: Buffer[] }> = ({ buffers }) => {
  const currentFileIndex = 0;
  if (buffers.length < 1) {
    return <div> no open files</div>;
  }
  return (
    <div>
      <BufferNavbar buffers={buffers} />
      <FileEditor file={buffers[currentFileIndex].file} />
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Explore the file system structure below:</h2>
      <EditorContainer />
    </div>
  );
}
