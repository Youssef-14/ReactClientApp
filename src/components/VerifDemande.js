import React, {Component} from "react";
import axios from "axios";

export class VerifDemande extends Component {
    state = {
        data: [],
        showPopup: false,
        showPopup2: false,
        demande: null,
        types: ['all'],
        status:['all','accepted','refused','be-corrected','encours'],
        filter:'all',
        pagination: {
            page: 1,
            limit: 5,
            pages : 1
        }
    }
    // Method to open the pop-up
    openPopUp = (demande) => {
        this.setState({ showPopup: true });
        this.setState({ demande: demande });
    }
    // Method to close the pop-up
    closePopUp = () => {
        this.setState({ showPopup: false });
    }

    // Lifecycle method
    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        axios
            .get('https://localhost:7095/get-all-demandes')
            .then(response => {
                const data = response.data;
                this.setState({ data });
                /*
                this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :Math.ceil(data.length/this.state.pagination.limit)   } })
                */
                data.forEach((demande) => {
                    if(!this.state.types.includes(demande.type)){
                        this.state.types.push(demande.type);
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
    updateDemand = (event,value) => {
        event.preventDefault();
        axios
            .put('https://localhost:7095/set-demande-to-'+value,this.state.demande)
            .then(response => {
                this.fetchData();
                this.closePopUp();
            })
            .catch(error => {
                console.error(error);
            });
    }
    demanadsrender() {
        return (
            <tbody>
            {
                this.state.data.map(demande =>
                    <tr key={demande.id}>
                        <td>{demande.type}</td>
                        <td>{demande.date}</td>
                        <td>{demande.comment}</td>
                        <td>{demande.status}</td>
                        <td><button className="btn text-white bg-dark" onClick={() =>this.openPopUp(demande)}>option</button></td>
                    </tr>
                ) }
            </tbody>);
    }

    // option pop-up render
    optionsrender(){
        return (
            <div className="popup">
                <div className="popup-content">
                    <button className="btn text-white bg-dark justify-content-center" onClick={this.closePopUp}>Close</button>
                    <form className={'form2'}>
                        <div className="form-group">
                            <label htmlFor="name">Type</label>
                            <input type="text" className="form-control" id="name" value={this.state.demande.type} placeholder="Enter name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Date</label>
                            <input type="text" className="form-control" id="email" value={this.state.demande.date} placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Commentaire</label>
                            <input type="text" className="form-control" id="email" value={this.state.demande.comment} placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">status</label>
                            <input type="text" className="form-control" id="email" defaultValue={this.state.demande.status} placeholder="Enter email" />
                        </div>
                        <hr/>
                        <button  className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateDemand(event,"accepted")}>Accepter</button>
                        <button  className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateDemand(event,"refused")}>Refuser</button>
                        <button  className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateDemand(event,"be-corrected")}>à corriger</button>
                    </form>
                </div>
            </div>
        );
    }
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
                                <th>Type</th>
                                <th>Date</th>
                                <th>Comment</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                        </table>
                        <button className="btn text-white bg-dark justify-content-right" onClick={this.openPopUp}>Add</button>
                    </div>
                </div>
            );
        }

        return (
            <div className={'main'}>
                <div>
                    <h1>Filter</h1>
                    Type de demande : <select id={'filter'} ref={this.filterElement} /*onChange={e => this.setState({filter:e.target.value})}*/>
                    {this.state.types.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                    </select><br/>
                    Status : <select id={'filter'} ref={this.filterElement} onChange={e => this.setState({filter:e.target.value})}>
                    {this.state.status.map(option => (
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
                                <th>Type</th>
                                <th>Date</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>options</th>
                            </tr>
                            </thead>
                            {
                                this.demanadsrender()
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
                                                //this.paginationNumberRender()
                                            }
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <br/><br/>
                        {this.state.showPopup && (this.optionsrender())}
                    </div>
                ) : (
                    <div>Loading data...</div>
                )}
            </div>
        );
    }
}