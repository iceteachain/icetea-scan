import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Layout from "../Layout/Layout";
import moment from "moment";
import MaterialIcon from "material-icons-react";
import "./Blocks.scss";
import { setPageSate } from '../../service/blockchain/get-realtime-data';
import diffTime from '../../service/blockchain/find-time-return';
import { getListBlockApi } from "../../service/api/get-list-data";

const mapStateToProps = state => {
  return {
    blocks: state.handleListBlocks,
    pageState: state.changePageState
  };
};

// Paging
const mapDispatchToProps = dispatch => {
  return {};
};

class Blocks extends Component {
  constructor() {
    super();
    this.state = {
      pageIndex: 1,
      blocks: [],
      list_time: []
    };
  }

  componentWillMount() {
    setPageSate();
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      for (let i = 0; i < this.props.blocks.length; i++) {
        let item = this.props.blocks[i].header.height;
        let time = await diffTime(item);

        this.state.list_time.push(time);
      }

      if (this.state.pageIndex === 1) {
        this.getBlocksByPageIndex(1);
      }
    }
  }

  // Set Time For Block
  loadBlocks() {
    const { blocks } = this.props;

    return blocks.map((item, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/block/${item.header.height}`}>
              {item.header.height}
            </Link>
          </td>
          <td>{moment(item.header.time).format("MMMM-DD-YYYY h:mm:ss")}</td>
          <td>{this.state.list_time[index]}</td>
          <td>
            <Link to={`/txs?block=${item.header.height}`}>
              {item.header.num_txs}
            </Link>
          </td>
          <td>
            <span>{item.header.chain_id}</span>
          </td>
          <td>
            <span>0 TEA</span>
          </td>
        </tr>
      );
    });
  }

  // Set Data By Page Index
  async getBlocksByPageIndex(pageIndex) {
    if (pageIndex <= 0) {
      pageIndex = 1;
    }
    console.log(pageIndex);

    if (pageIndex >= this.props.pageState.pageBlockLimit) {
      pageIndex = this.props.pageState.pageBlockLimit;
    }

    this.setState({
      pageIndex
    });

    // return handledata.getBlocks(maxheight, pageIndex, 20);
    getListBlockApi({
      page_index: this.state.pageIndex,
      page_size: this.props.pageState.pageSize
    });
  }

  render() {
    return (
      <Layout>
        <div className="block_page mt_50 mb_30">
          <div className="container">
            <div className="block_page page_info_header">
              <h3>Blocks</h3>
              <div className="breadcrumb">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/blocks">Blocks</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="table_data">
              <table>
                <thead>
                  <tr>
                    <th>Height</th>
                    <th>Time</th>
                    <th>Age</th>
                    <th>Txns</th>
                    <th>Node</th>
                    <th>Fees</th>
                  </tr>
                </thead>
                <tbody>{this.loadBlocks()}</tbody>
              </table>
            </div>
            <div className="pagination">
              <ul>
                <li />
              </ul>
            </div>
            <div className="page-index">
              <div className="paging">
                <button
                  className="btn-common"
                  onClick={() => {
                    this.getBlocksByPageIndex(1);
                  }}
                >
                  First
                </button>
                <button
                  className="btn-cusor"
                  onClick={() => {
                    this.getBlocksByPageIndex(this.state.pageIndex - 1);
                  }}
                >
                  <MaterialIcon icon="keyboard_arrow_left" />
                </button>
                <span className="state">
                  Page {this.state.pageIndex} of{" "}
                  {this.props.pageState.pageBlockLimit}{" "}
                </span>
                <button
                  className="btn-cusor"
                  onClick={() => {
                    this.getBlocksByPageIndex(this.state.pageIndex + 1);
                  }}
                >
                  <MaterialIcon icon="keyboard_arrow_right" />
                </button>
                <button
                  className="btn-common"
                  onClick={() => {
                    this.getBlocksByPageIndex(
                      this.props.pageState.pageBlockLimit
                    );
                  }}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blocks);
