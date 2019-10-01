import React from "react";
import "./App.css";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nombre_empleado: "",
      id: "",
      foto_empleado: "",
      children: [],
      parent: []
    };
    this.getData = this.getData.bind(this);
    this.getValue = this.getValue.bind(this);
    this.consolea = this.consolea.bind(this);
  }

  getData(id) {
    console.log(id);
    if (!isNaN(id)) {
      fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.setState({
            nombre_empleado: data.nombre_empleado + data.apellidos_empleado,
            id: data.id_empleado,
            foto_empleado: data.foto_empleado
          });
          return fetch(
            `https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`
          )
            .then(response => response.json())
            .then(data => {
              console.log(data);
              this.setState({
                parent: [data]
              });
              if (data.id_superior !== "") {
                return fetch(
                  `https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`
                )
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                    const spread = [data, ...this.state.parent];
                    this.setState({
                      parent: spread
                    });
                  });
              }
            });
        });
    }
  }

  getValue(ev) {
    const value = parseInt(ev.target.value);
    this.getData(value);
  }

  consolea(ev) {
    console.log(ev.currentTarget.dataset.id);
  }

  render() {
    console.log(this.state.parent);
    const MyNodeComponent = ({ node }) => {
      return (
        <div className="initechNode" onClick={this.consolea} data-id={node.id}>
          <img src={node.foto_empleado} className="img"></img>
          <p>{node.nombre_empleado}</p>
        </div>
      );
    };

    const parentsState = this.state.parent;
    const parents = parentsState.map((parent, index) => {
      return (
        <React.Fragment key={index}>
          <OrgChart tree={parent} NodeComponent={MyNodeComponent} />
          <div className="rayita"></div>
        </React.Fragment>
      );
    });

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
