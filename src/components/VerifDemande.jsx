import React, {Component} from "react";
import axios from "axios";
import dateRender from "../_helpers/DateRender";
import {getToken} from "../_services/account.services";
/*import {Stack} from "@mui/material";
import Pagination from '@mui/material/Pagination';*/

export class VerifDemande extends Component {

    filterElement = React.createRef();
    state = {
        isAuthorized: false,
        data: [],
        data_length: 0,
        showPopup: false,
        showPopup2: false,
        demande: null,
        types: ['all'],
        status:['encours','all','accepté','refusé','àcorriger'],
        filter_type:'all',
        filter_status:'encours',
        tri :"récente",
        pagination: {
            page: 1,
            limit: 5,
            pages : 1
        },
        files: []
    }
    // Method to open the pop-up
    openPopUp = (demande) => {
        this.setState({ showPopup: true });
        this.setState({ demande: demande });
        this.getfilesnames();
    }
    // Method to close the pop-up
    closePopUp = () => {
        this.setState({ showPopup: false });
    }

    // Lifecycle method
    componentDidMount() {
        // Check if the user is authorized
        this.getDataLength();
    }

    handlePaginationNumberChange(e,page) {
        this.setState({pagination:{limit:this.state.pagination.limit,page,pages: this.state.pagination.pages}}, () => {
            this.getDataLength();
        });
    }

    handlePaginationChange(e) {
        this.setState({pagination:{limit:e.target.value,page:1,pages: Math.ceil( this.state.data_length/e.target.value)}}, () => {
            this.getDataLength();
        });
    }

    handleFilterStatusChange(e) {
        this.setState({ filter_status: e.target.value }, () => {
            this.setState({ pagination: {page: 1,limit: this.state.pagination.limit,pages :this.state.pagination.pages  } })
            this.getDataLength();
        });
    }
    handleFilterTypeChange(e) {
        this.setState({ filter_type: e.target.value }, () => {
            this.setState({ pagination: {page: 1,limit: this.state.pagination.limit,pages :this.state.pagination.pages  } })
            this.getDataLength();
        });
    }
    handleTriChange(e) {
        this.setState({ tri: e.target.value }, () => {
            this.getDataLength();
        });
    }

    getDataLength = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .get("https://localhost:7095/Demands/get-demandes-filtered-number/"+this.state.filter_type+"/"+this.state.filter_status, { headers: headers })
            .then(response => {
                this.setState({ data_length: response.data })
                this.fetchData();
            })
            .catch(error => {
                console.error(error);
            });
    }
    //get files
    getfilesnames() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .get('https://localhost:7095/getallfiles/yo', { headers: headers })
            .then(response => {
                this.setState({ files: response.data });
            })
            .catch(error => {
                console.log(error);
            });
    }
    deletefile(file) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .delete('https://localhost:7095/delete/yo/'+file, { headers: headers })
            .then(response => {
                this.getfilesnames();
            })
            .catch(error => {
                console.log(error);
            });
    }
    getfile(file) {
        axios({
            method: 'get',
            url: "https://localhost:7095/download/yo/"+file,
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/pdf',
                'Authorization': `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                const blob = new Blob([response.data], {
                    type: 'application/pdf'
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            });

    }
    fetchData = () => {
        const min = (this.state.pagination.page - 1) * this.state.pagination.limit;
        const max = this.state.pagination.limit;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .get("https://localhost:7095/Demands/get-filtered-demands/"+this.state.filter_type+"/"+this.state.filter_status+"/"+min+"/"+max+"/"+this.state.tri, { headers: headers })
            .then(response => {
                const data = response.data;
                this.setState({ data: data })
                this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :Math.ceil(this.state.data_length/this.state.pagination.limit)   } })
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
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        };
        axios
            .put('https://localhost:7095/Demands/set-demande-to-'+value+"/"+this.state.demande.id,"", { headers: headers })
            .then(response => {
                if(this.state.pagination.page > 1){
                    this.setState({ pagination: {page: this.state.pagination.page-1,limit: this.state.pagination.limit,pages :this.state.pagination.pages  } })
                    this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :this.state.pagination.pages-1  } })
                }
                this.fetchData();
                this.closePopUp();
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
                <td key={page} className={'pa'} value={page} onClick={e =>this.handlePaginationNumberChange(e,page) }>
                    <button>{page}</button>
                </td>
            ))
        );
    }

    demanadsrender() {
        return (
            <tbody>
            {
                this.state.data.map(demande =>
                    <tr key={demande.id}>
                        <td>{demande.type}</td>
                        <td>{dateRender(demande.date)}</td>
                        <td>{demande.status}</td>
                        <td><button className="btn text-bg-warning" onClick={() =>this.openPopUp(demande)}>option</button></td>
                    </tr>
                )
            }
            </tbody>);
    }
    optionsButtonRender(status){
        if(status === "encours"){
            return(
                <>
                <button  className="btn text-bg-warning m-1" onClick={(event) => this.updateDemand(event,"accepted")}>Accepter</button>
                <button  className="btn text-bg-warning m-1" onClick={(event) => this.updateDemand(event,"refused")}>Refuser</button>
                <button  className="btn text-bg-warning m-1" onClick={(event) => this.updateDemand(event,"be-corrected")}>à corriger</button>
                </>
            );
        }else if(status === "accepté"){
            return(
                <>
                <button  className="btn text-bg-warning m-1" onClick={(event) => this.updateDemand(event,"completed")}>Terminer</button>
                </>
            );
        }else if(status === "refusé"){
            return(
                <>
                <button  className="btn text-bg-warning m-1" onClick={(event) => this.updateDemand(event,"be-corrected")}>Terminer</button>
                </>
            );
        }else if(status === "àcorriger"){
            return(
                <>
                <button  className="btn text-bg-warning m-1" onClick={(event) => this.updateDemand(event,"refused")}>Refuser</button>
                </>
            );
        }


    }

    // option pop-up render
    optionsrender(){
        return (
            <div className="popup">
                <div className="popup-content">
                    <i className="close" onClick={this.closePopUp}>Close</i>
                    <form className={'form2'}>
                        <div className="form-group">
                            <label htmlFor="name">Type</label>
                            <input type="text" className="form-control" id="name" defaultValue={this.state.demande.type} placeholder="Enter name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Date</label>
                            <input type="text" className="form-control" id="email" defaultValue={this.state.demande.date} placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Commentaire</label>
                            <textarea className="form-control" name="comment" defaultValue={this.state.demande.comment} id="email"
                                      placeholder="Donner un commentaire"></textarea>

                        </div>
                        <div className="form-group">
                            <label htmlFor="email">status</label>
                            <input type="text" className="form-control" id="email" defaultValue={this.state.demande.status} placeholder="Enter email" />
                        </div>
                        <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Download</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.files.map((file, index) => (
                            <tr key={index}>
                                <td>{file}</td>
                                <td>
                                    <button type="button" variant="primary" onClick={()=>this.getfile(file)}>View</button>{' '}
                                </td>
                                <td>
                                    <button type="button" variant="primary" onClick={()=>this.deletefile(file)}>Delete</button>{' '}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                        <hr/>
                        {this.optionsButtonRender(this.state.demande.status)}
                    </form>
                </div>
            </div>
        );
    }
    render() {
        const { data } = this.state;

        return (
            <div className={'main'}>
                <div>
                    <h3>Filter</h3>
                    Type de demande : <select id={'filter'} ref={this.filterElement} onChange={e => this.handleFilterTypeChange(e)}>
                    {this.state.types.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                    </select><span> </span>
                    Status : <select id={'filter'} ref={this.filterElement} onChange={e => this.handleFilterStatusChange(e)}>
                    {this.state.status.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select><br/>
                <select onChange={e => this.handleTriChange(e)}>
                    <option value="récente">Tri : Plus récents</option>
                    <option value="ancienne">Tri : Plus anciennes</option>
                </select>
                </div>
                {data ? (<div>
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                            <tr>
                                <th>Type</th>
                                <th>Date</th>
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
                                <td width={'10px'}>
                                    <select id={'pagination'} defaultValue={5} onChange={e => this.handlePaginationChange(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                    </select>
                                </td>
                                <td align={'center'}>
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
                        {this.state.showPopup && (this.optionsrender())}
                    </div>
                ) : (
                    <div>Loading data...</div>
                )}
            </div>
        );
    }
}