import React from "react";
import AlphabetSoup from "./AlphabetSoup";
import "../../../styles/PlayGround/AlphabetSoup.scss";

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||||||||||||            APP GENERAL          ||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class App extends React.Component {
  // =================================================
  // ========         CONSTRUCTOR              =======
  // =================================================
  constructor(props) {
    super(props);
    this.state = {
      WordsType: "Paises",
      EnableHints: true,
      TemporalBoardSize: 10,
      BoardSize: 10,
      Words: {
        Paises: [
          "alemania",
          "argentina",
          "australia",
          "canada",
          "chile",
          "china",
          "españa",
          "francia",
          "india",
          "inglaterra",
          "iran",
          "italia",
          "japon",
          "mexico",
          "peru",
          "rusia",
          "sudafrica",
          "turquia",
          "usa"
        ]
      }
    };
  }

  render() {
    return (
      <div>
        <AlphabetSoup
            Words={this.state.Words[this.state.WordsType]}
            VerticalSize={this.state.BoardSize}
            HorizontalSize={this.state.BoardSize}
            NumberOfTries={250}
            EnableHints={this.state.EnableHints}
        />
      </div>
    );
  }
}