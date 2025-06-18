import html from "html";

export default function Canvas(props) {
  console.log(props);
  return html`<canvas ref=${(e) => props.ref(e)} width="256" height="256" />`;
}
