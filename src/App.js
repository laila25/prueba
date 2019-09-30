import React from "react";
import "./App.css";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      url: "",
      children: [],
      parent: {
        name: "hola"
      }
    };
    this.getData = this.getData.bind(this);
    this.getData();
  }

  getData() {
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

  render() {
    const MyNodeComponent = ({ node }) => {
      return (
        <div className="initechNode">
          <img src={node.url} className="img"></img>
          <p>{node.name}</p>
        </div>
      );
    };

    console.log(this.state);
    return (
      <React.Fragment>
        <div className="App flex" id="initechOrgChart">
          <OrgChart tree={this.state.parent} NodeComponent={MyNodeComponent} />
          <div className="rayita"></div>
        </div>
        <div className="App" id="initechOrgChart">
          <OrgChart tree={this.state} NodeComponent={MyNodeComponent} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
