import React, {Component} from 'react';
import axios from 'axios';
import './styles/pop-up.css';

export class FetchData extends Component {

    //method that delete sucks. I need to fix it. i'm passing it to tr key

    filterElement = React.createRef();
    // Initialize the state
    state = {
        data: [],
        showPopup: false,
        showPopup2: false,
        employe: null,
        departments: [],
        filter: 'all',
        pagination: {
            page: 1,
            limit: 5,
            pages : 1
        }
    }
    // Method to open the pop-up
    openPopUp = () => {
        this.setState({ showPopup: true });
    }
    // Method to close the pop-up
    closePopUp = () => {
        this.setState({ showPopup: false });
    }
    // Method to open the pop-up 2
    openPopUp2 = (employe) => {
        this.setState({ showPopup2: true });
        this.setState({ employe: employe });
    }
    // Method to close the pop-up 2
    closePopUp2 = () => {
        this.setState({ showPopup2: false });
    }

    // Lifecycle method
    componentDidMount() {
        this.fetchData();
    }

    changeFilterContent = () => {
        this.filterElement.current.innerHTML = '<option value="all">All</option> ' + this.state.departments.map(department => '<option value="' + department + '">' + department + '</option>');
    }

    // Fetch Data from API
    fetchData = () => {
        axios
            .get('https://localhost:7095/get-all-employes')
            .then(response => {
              const data = response.data;
              this.setState({ data });
                this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :Math.ceil(data.length/this.state.pagination.limit)   } });
                //this.state.departments = [];
                data.forEach((employe) => {
                  if(!this.state.departments.includes(employe.department)){
                      this.state.departments.push(employe.department);
                  }
              });
            })
            .catch(error => {
              console.error(error);
            });
    }

    paginationNumberRender(){

        let paginationNumbers = [];
        for(let i = 1; i <= this.state.pagination.pages; i++){
            paginationNumbers.push(i);
        }
        return(
        paginationNumbers.map(page => (
            <td key={page} value={page} onClick={e => this.setState({pagination:{limit:this.state.pagination.limit,page,pages: this.state.pagination.pages}})}>
                <button>{page}</button>
            </td>
        ))
        );
    }

    //Ajouter un employé
    addEmploye = (event) => {
        event.preventDefault();

        const {form} = event.target

        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const department = form.elements.department.value;

        axios
            .post('https://localhost:7095/create-employe', {
                name: name,
                email: email,
                department: department,
            }).then(() => {
            this.closePopUp();
            this.changeFilterContent();
            this.fetchData();
        })
            .catch(error => {
                    console.error(error);
                }
            );
    }

    //Supprimer un employé
    deleteEmploye = (id) =>{
        axios
            .delete('https://localhost:7095/delete-employe-by-id/' + id)
            .then(() => {
                this.closePopUp2();
                this.changeFilterContent();
                this.fetchData();

            })
            .catch(error => {
                    console.error(error);
                }
            );
    }

    // update the employe
    updateEmploye = (event2,id) => {
        event2.preventDefault();

        const {form} = event2.target

        const name = form.name.value;
        const email = form.email.value;
        const department = form.department.value;

        axios
            .put('https://localhost:7095/update-employe', {
                id: id,
                name: name,
                email: email,
                department: department,
            }).then(() => {
                this.closePopUp2();
                this.changeFilterContent();
                this.fetchData();
        })
            .catch(error => {
                    console.error(error);
                }
            );
    }

    // option pop-up render
    optionsrender(employe){
        return (
            <div className="popup">
                <div className="popup-content">
                    <button className="btn text-white bg-dark justify-content-center" onClick={this.closePopUp2}>Close</button>
                    <form className={'form2'}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" id="name" defaultValue={this.state.employe.name} placeholder="Enter name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" defaultValue={this.state.employe.email} placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input type="text" className="form-control" id="department" defaultValue={this.state.employe.department} placeholder="Enter department" />
                        </div>
                        <button type="submit" className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateEmploye(event,employe.id)}>Update</button>
                    </form>
                </div>
            </div>
        );
    }

    // create the pop-up render
    createrender() {
        return (
            <div className="popup">
                <div className="popup-content">
                    <form className={'form'}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" id="name" placeholder="Enter name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input type="text" className="form-control" id="department" placeholder="Enter department" />
                        </div>
                        <button type="submit" className="btn text-white bg-dark btn-primary" onClick={this.addEmploye}>Submit</button>
                    </form>
                    <button className="btn text-white bg-dark justify-content-center" onClick={this.closePopUp}>Close</button>
                </div>
            </div>
        );
    }

    employesrender(){
        const min = (this.state.pagination.page - 1) * this.state.pagination.limit;
        const max = this.state.pagination.page * this.state.pagination.limit;
        return (
            <tbody>
                {
                    this.state.data.filter(employe => {
                        if(this.state.filter === 'all'){
                            return employe;
                        }else{
                            return employe.department === this.state.filter;
                        }
                        // eslint-disable-next-line array-callback-return
                    }).filter(employe => {
                    if(this.state.data.indexOf(employe)>=min && this.state.data.indexOf(employe)<max){
                    return employe;
                }
                }).map(employe =>
                    <tr key={employe.id}>
                        <td>{employe.id}</td>
                        <td>{employe.name}</td>
                        <td>{employe.email}</td>
                        <td>{employe.department}</td>
                        <td><button className="btn text-white bg-dark" onClick={() =>this.openPopUp2(employe)}>option</button></td>
                        <td><button className="btn text-white bg-dark" onClick={() =>this.deleteEmploye(employe.id)}>Delete</button></td>
                    </tr>
                    ) }
            </tbody>);
    }

    // Render the data
    render() {
        const { data } = this.state;
        if (data.length === 0) {
            return (
                <div className="container main">
                    <h1 className="text-center">No data</h1>
                    <div>
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>name</th>
                                <th>email</th>
                                <th>department</th>
                                <th>options</th>
                            </tr>
                            </thead>
                        </table>
                        {this.state.showPopup2 && (this.optionsrender(this.state.employe))}
                        <button className="btn text-white bg-dark justify-content-right" onClick={this.openPopUp}>Add</button>
                        {this.state.showPopup && (this.createrender())}
                    </div>
                </div>
            );
        }

        return (
            <div className={'main'}>
                <div>
                    <h1>Filter</h1>
                    Department : <select id={'filter'} ref={this.filterElement} onChange={e => this.setState({filter:e.target.value})}>
                        <option value="all">ALL</option>
                        {this.state.departments.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
              {data ? (<div>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>name</th>
                    <th>email</th>
                    <th>department</th>
                    <th>options</th>
                    <th>Delete /filter probleme</th>
                </tr>
                </thead>
                {
                    this.employesrender()
                }
                </table>
                      <table className='table table-striped' aria-labelledby="tabelLabel">
                            <tbody>
                          <tr>
                                <td>
                      <select id={'pagination'} defaultValue={5} onChange={e => this.setState({pagination:{limit:e.target.value,page:1,pages: Math.ceil( data.length/e.target.value)}})}>
                              <option value="5">5</option>
                              <option value="10">10</option>
                              <option value="15">15</option>
                              <option value="20">20</option>
                      </select>
                                </td>
                                <td>
                      <table>
                          <tbody>
                          <tr>
                          {
                              this.paginationNumberRender()
                            }
                          </tr>
                            </tbody>
                      </table>
                                </td>
                          </tr>
                            </tbody>
                      </table>
                      <br/><br/>
                      {this.state.showPopup2 && (this.optionsrender(this.state.employe))}
                      <button className="btn text-white bg-dark justify-content-right" onClick={this.openPopUp}>Add</button>
                      {this.state.showPopup && (this.createrender())}
                  </div>
              ) : (
                  <div>Loading data...</div>
                  )}
            </div>
        );
    }
}