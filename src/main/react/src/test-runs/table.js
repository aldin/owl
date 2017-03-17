import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import ExecutionResult from '../../components/Execution-Result';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import SuccessRate from '../../components/SuccessRate';
import TimeFormat from '../../components/TimeFormat';
import DurationFormat from '../../components/DurationFormat';

const EMPTY_TEST_RUNS = {
  content: []
}

class TestRunsPageTable extends React.Component {
  constructor(){
    super();

    this.state = {
      isDataLoading: true,
      testRuns: EMPTY_TEST_RUNS,
      toggle: 'asc'
    }
    
    this.getSortedData = this.getSortedData.bind(this);
  }

  componentDidMount() {
    this.getPageData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getPageData(nextProps);
  }

  getPageData(props) {
    this.setState({ isDataLoading: true });

    this.getTestRuns(props.location.query.build,
      props.location.query.page,
      props.location.query.size)
    .then(testRuns => this.setState({ isDataLoading: false, testRuns: testRuns }));
  }

 getTestRuns(build = '', page = 0, size = 10, param = '') {
    return fetch(`/api/v1/test-runs?build=${build}&page=${page}&size=${size}&sort=${param}`)
      .then(response => response.json());
  }

  formatParam(e){
    let str = e.target.textContent;
    str = str.replace(/\s+/g, '');
    
    if (str == 'ExecutionFinished') str = 'updatedAt'; // Add formating for other fields
    return str;
  }

  getSortedData(e) {
    let param = this.formatParam(e);  
    this.setState({ toggle: ( this.state.toggle === 'asc' ) ? 'desc' : 'asc' })
    browserHistory.push('?sort='+ param +','+ this.state.toggle);

    this.getTestRuns(this.props.location.query.build,
      this.props.location.query.page,
      this.props.location.query.size, 
      this.props.location.query.sort)
    .then(testRuns => {
      this.setState({ testRuns: testRuns})
    });
  }


  render() {
    function linkToTestRunsByBuild(build) {
      return `/test-runs?build=${build}`;
    }

    function linkToTestCase(testRunId) {
      return `/test-runs/${testRunId}/test-cases`;
    }

    function linkToTestSteps(testRunId, testGroupName) {
      return `/test-runs/${testRunId}/test-steps/${testGroupName}`;
    }

    let activeBuildQuery = null;
    if (this.props.location.query.build) {
      activeBuildQuery = <li className="active">{this.props.location.query.build}</li>;
    }

    return (
      <Spinner isShown={this.state.isDataLoading} text="Fetching test runs">
        <div className="row">
          <div className="col-md-12">
            <ol className="breadcrumb">
              <li><Link to="/">Dashboard</Link></li>
              {activeBuildQuery}
            </ol>
          </div>
        </div>

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th onClick={ this.getSortedData }>Jenkins Build</th>
              <th onClick={ this.getSortedData }>Test Suite</th>
              <th onClick={ this.getSortedData }>Execution Finished</th>
              <th onClick={ this.getSortedData }>Total Cases</th>
              <th>Failed Cases</th>
              <th>Pending Cases</th>
              <th onClick={ this.getSortedData }>Success Rate</th>
              <th onClick={ this.getSortedData }>Duration</th>
            </tr>
          </thead>
          <tbody>
          {notEmpty(this.state.testRuns.content,
            this.state.testRuns.content.map(testRun =>
              <tr key={testRun.id}>
                <td><Link to={linkToTestRunsByBuild(testRun.build)}>{testRun.build}</Link></td>
                <td><Link to={linkToTestCase(testRun.id)}>{testRun.testSuite.suite}</Link></td>
                <td><TimeFormat time={testRun.updatedAt} format='dd/mm/yyyy HH:MM' /></td>
                <td>{testRun.exampleCount}</td>
                <td>{testRun.failureCount}</td>
                <td>{testRun.pendingCount}</td>
                <td><SuccessRate total={testRun.exampleCount} current={testRun.failureCount + testRun.pendingCount} /></td>
                <td><DurationFormat duration={testRun.duration} /></td>
              </tr>
            ),
            <tr>
              <td colSpan="6" className="text-center text-muted">No test runs available for this build.</td>
            </tr>
          )}
          </tbody>
        </table>

        <Pagination to={this.props.location.pathname} paginatedResponse={this.state.testRuns} />
      </Spinner>
    );
  }
}

function notEmpty(input, value, valueIfEmpty) {
  return input.length ? value : valueIfEmpty;
}

export default TestRunsPageTable;
