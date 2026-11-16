import fs from 'fs';
import { marked } from "marked";

export default function Contribute() {
    const string = fs.readFileSync("./src/data/CONTRIBUTE.md", 'utf8')

    const text      = string;
    const html      = marked.parse(text, { async: false });
    
    return <div style={{margin: "auto", maxWidth: "1900px", padding:'2em 0'}} dangerouslySetInnerHTML={{ __html: html }} />
}