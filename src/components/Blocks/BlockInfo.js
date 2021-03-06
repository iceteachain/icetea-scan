import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HeaderMap, Age, Block, TimeWithFormat } from '../elements/Common';
import { singleBlock, _get } from '../../service';

class BlockInfo extends Component {
  constructor() {
    super();
    this.state = {
      height: 1,
      parentHeight: 0,
      time: '',
      num_txs: 0,
      blockInfo: null,
      blockHash: '',
      parentHash: '',
      node: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const height = nextProps.match.params.blockId;
    if (height !== prevState.height) {
      return { height };
    }
    return null;
  }

  componentDidMount() {
    this.loadBlockInfo();
  }

  componentDidUpdate(prevProp, prevState) {
    const { height } = this.state;
    if (prevState.height !== height) {
      this.loadBlockInfo();
    }
  }

  async loadBlockInfo() {
    const { height } = this.state;

    const response = await _get(null, singleBlock + '/' + height);
    if (response.status === 200 && response.data[0]) {
      const { data } = response;
      const blockInfo = data[0];
      this.setState({
        height: blockInfo.height,
        blockInfo: blockInfo,
        blockHash: blockInfo.hash,
        num_txs: blockInfo.num_txs,
        node: blockInfo.chain_id,
        time: blockInfo.time,
      });
      await this.loadParentHeight(height);
    } else {
      this.props.history.push('/exception');
    }
  }

  async loadParentHeight(height) {
    let parentHeight = 1;
    if (height - 2 > 0) {
      parentHeight = height - 2;
    }
    const resp = await _get(null, singleBlock + '/' + parentHeight);

    if (resp.status === 200 && resp.data[0]) {
      const { data } = resp;
      const parentBlockInfo = data[0];
      this.setState({
        parentHash: parentBlockInfo.hash,
        parentHeight: parentHeight,
      });
    } else {
      this.setState({
        parentHash: 'N/A',
      });
    }
  }

  render() {
    const { height, parentHeight, time, num_txs, blockHash, parentHash, node } = this.state;

    return (
      <div className="detailBlocks">
        <div className="flex-wrap">
          <div className="flexBox">
            <h3>Block</h3>
            <span className="id_status">#{height}</span>
          </div>
          <HeaderMap
            value={[
              { path: '/', text: 'Home' },
              { path: '/blocks', text: 'Blocks' },
              { path: `/block/${height}`, text: 'Block' },
            ]}
          />
        </div>

        <div className="block_content page_info_content">
          <div className="title">
            <i className="fa fa-cubes" />
            <span>Block Information</span>
          </div>
          <div className="info_body">
            <div className="row_detail">
              <span className="label">TimeStamp: </span>
              <div className="text_wrap">
                <Age value={time} />
                &nbsp;[&nbsp;
                <TimeWithFormat value={time} />
                &nbsp;]&nbsp;
              </div>
            </div>
            <div className="row_detail">
              <span className="label">Transactions:</span>
              <div className="text_wrap">
                {num_txs === 0 ? '0' : <Link to={`/txs?height=${height}`}>{num_txs}</Link>}
                <span> Transactions in this block</span>
              </div>
            </div>
            <div className="row_detail">
              <span className="label">BlockHash:</span>
              <div className="text_wrap">{blockHash}</div>
            </div>
            <div className="row_detail">
              <span className="label">ParentHash:</span>
              <div className="text_wrap">
                <Block value={parentHeight} onClick={() => this.loadBlockInfo(parentHeight)}>
                  {parentHash}
                </Block>
              </div>
            </div>
            <div className="row_detail">
              <span className="label">Node:</span>
              <div className="text_wrap transaction_type">{node}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BlockInfo;
