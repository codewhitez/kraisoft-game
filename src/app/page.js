// import styles from "./page.module.css";

import "./page.scss";

export default function HomePage() {
  return (
    <div className="intro">
      <h1>Welcome to the pure HTML Dragging Game</h1>
      <h2>How to play?</h2>
      <p>Just click anywhere in the empty area to sprawn new rectangles.</p>
      <p>You can move aroud the rectangles and the last interacted rectangle will always be on top.</p>
      <p>It is also responsive to screen sizes and works with touch events as well.</p>
      <p><b>Now, Let's go to the play page and have fun!</b></p>
    </div>
  );
}
