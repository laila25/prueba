import React from "react";
import "./App.css";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import perroViejo from "./perro-viejo.jpg"

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      url: "",
      children: [],
      parent: [
        {
          name: "hola",
          url: `${perroViejo}`
        },
        {
          name: "adios",
          url: `${perroViejo}`
        }
      ]
    };
    this.getData = this.getData.bind(this);
    this.getValue = this.getValue.bind(this);
    this.changeColorSelected = this.changeColorSelected.bind(this)
  }

  getData(id) {
    console.log(id);
    fetch("./data.json")
      .then(response => response.json())
      .then(data => {
        console.log(data[0].name);
        this.setState({
          name: data[0].name
        });
        return fetch(`./data-children${data[0].id}.json`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.setState({
              children: data
            });
          });
      });
    fetch("./data.json")
      .then(response => response.json())
      .then(data => {
        return fetch(`./data-img${data[0].id}.json`)
          .then(response => response.json())
          .then(data => {
            this.setState({
              url: data.url
            });
          });
      });
  }

  getValue(ev) {
    const value = ev.target.value;
    console.log(value);
    this.getData(value);
  }

  changeColorSelected(ev) {
    console.log(ev)
    const selected = ev.currentTarget
    selected.classList.remove("initechNode")
    selected.classList.toggle("red")
  }
  render() {
    const MyNodeComponent = ({ node }) => {
      return (
        <div onClick={this.changeColorSelected} className="initechNode">
          <img src={node.url} className="img" alt=""></img>
          <p>{node.name}</p>
        </div>
      );
    };

    const parents = this.state.parent.reverse().map(parent => {
      return (
        <React.Fragment>
          <OrgChart tree={parent} NodeComponent={MyNodeComponent} />
          <div className="rayita"></div>
        </React.Fragment>
      );
    });

    console.log(this.state);
    return (
      <React.Fragment>
        <input type="text" onChange={this.getValue}></input>

        <div className="App flex" id="initechOrgChart">
          {parents}
        </div>

        <div className="App" id="initechOrgChart">
          <OrgChart tree={this.state} NodeComponent={MyNodeComponent} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
