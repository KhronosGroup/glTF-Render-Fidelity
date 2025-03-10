import fs from 'fs';
import Showdown from "showdown";

export default function About() {
    const string = fs.readFileSync("./src/data/ABOUT.md", 'utf8')

    const converter = new Showdown.Converter({ tables: true });
    const text      = string;
    const html      = converter.makeHtml(text);
    
    return <div style={{margin: "auto", maxWidth: "1900px"}} dangerouslySetInnerHTML={{ __html: html }} />
}