import { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {inline} from "./toolbar/option";

// Without SSR 
import { Editor } from 'react-draft-wysiwyg';

// with NextJs SSR (also import this component with next/dynamic 
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
});

const PostEditor = ({ initialValue,onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    const contentBlock = htmlToDraft(initialValue);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    const contentBlock = htmlToDraft(initialValue);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const initialEditorState = EditorState.createWithContent(contentState);
      setEditorState(initialEditorState);
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [initialValue]);



  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    onChange(draftToHtml(convertToRaw(newEditorState.getCurrentContent()))); // State Lifted
  };

  const getEditorContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    return JSON.stringify(rawContent);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={toolBarOptions}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        hashtag={{
          separator: ' ',
          trigger: '#',
        }}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: [
            { text: 'JavaScript', value: 'javascript', url: 'js' },
            { text: 'Golang', value: 'golang', url: 'go' },
          ],
        }}
      />

      <button onClick={() => console.log(getEditorContent())}>Log Editor Content</button>
    </div>
  );
};

export default PostEditor;
const toolBarOptions ={
  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
  // ... more settings
}
