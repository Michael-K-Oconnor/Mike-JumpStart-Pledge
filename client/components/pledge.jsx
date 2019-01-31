import React from "react";
import axios from "axios";
import "../styles/app.css";

const addCommas = number => {
  let stringNum = "";
  let arrayNum = String(Math.ceil(number))
    .replace(/,/gi, "")
    .split("")
    .reverse();
  for (let i = 0; i < arrayNum.length; i++) {
    if (i > 0 && i % 3 === 0) {
      stringNum = "," + stringNum;
    }
    stringNum = arrayNum[i] + stringNum;
  }
  return stringNum;
};

export default class Pledge extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      pledge_amount: "10",
      isValidNumber: true,
      hasBacked: false,
      pledgesRoute: window.location.origin + "/pledges/",
      fundedRatio: "0px"
    };
  }

  isValidNum(num) {
    if (!isNaN(num) && Number(num) > 0) {
      if (num.split(".")[1]) {
        return num.split(".")[1].length < 3;
      } else {
        return true;
      }
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      axios.get(this.state.pledgesRoute + (this.props.id || 1)).then(result => {
        Math.ceil(
          (result.data.pledged / result.data.goal) *
            (window.innerWidth * 0.35 * 0.8)
        ) + "px";
        this.setState({
          goal: addCommas(result.data.goal),
          pledged: addCommas(result.data.pledged),
          backer_count: addCommas(result.data.backer_count),
          days_left: addCommas(result.data.days_left),
          fundedRatio:
            Math.min(
              Math.ceil(
                (result.data.pledged / result.data.goal) *
                  (window.innerWidth * 0.35 * 0.8)
              ),
              window.innerWidth * 0.35 * 0.8
            ) + "px",
          pledge_amount: "10",
          hasBacked: false
        });
      });
    }
  }

  componentDidMount() {
    axios.get(this.state.pledgesRoute + (this.props.id || 1)).then(result => {
      this.setState({
        goal: addCommas(result.data.goal),
        pledged: addCommas(result.data.pledged),
        backer_count: addCommas(result.data.backer_count),
        days_left: addCommas(result.data.days_left),
        fundedRatio:
          Math.min(
            Math.ceil(
              (result.data.pledged / result.data.goal) *
                (window.innerWidth * 0.35 * 0.8)
            ),
            window.innerWidth * 0.35 * 0.8
          ) + "px"
      });
    });
  }

  handleClick(e) {
    e.preventDefault();
    axios
      .post(this.state.pledgesRoute, {
        id: this.props.id || 1,
        pledge_amount: Number(this.state.pledge_amount),
        hasBacked: this.state.hasBacked
      })
      .then(() => {
        return axios.get(this.state.pledgesRoute + (this.props.id || 1));
      })
      .then(result => {
        this.setState({
          pledged: addCommas(result.data.pledged),
          backer_count: addCommas(result.data.backer_count),
          fundedRatio:
            Math.min(
              Math.ceil(
                (result.data.pledged / result.data.goal) *
                  (window.innerWidth * 0.35 * 0.8)
              ),
              window.innerWidth * 0.35 * 0.8
            ) + "px",
          pledge_amount: "",
          hasBacked: true
        });
      });
  }

  handleChange(e) {
    this.setState({
      pledge_amount: e.target.value,
      isValidNumber: this.isValidNum(e.target.value)
    });
  }

  render() {
    return (
      <div className="component">
        <div
          className="progressBar"
          style={{ width: this.state.fundedRatio }}
        />
        <div className="progressBackground" />
        <div className="pledgedAmount">${this.state.pledged}</div>
        <div className="subText">pledged of ${this.state.goal} goal</div>
        <div className="secondaryStats">{this.state.backer_count}</div>
        <div className="subText">backers</div>
        <div className="secondaryStats">{this.state.days_left}</div>
        <div className="subText">days left</div>
        <form className="input-icon">
          <input
            className="pledgeInput"
            type="number"
            name="pledge_amount"
            min="0"
            max="1000000"
            value={this.state.pledge_amount}
            onChange={this.handleChange}
          />
          <i className="bling">$</i>
        </form>
        <input
          className="pledgeButton"
          type="submit"
          name="pledge_submit"
          value="Make A Pledge"
          onClick={this.handleClick}
          disabled={!this.state.isValidNumber}
        />
      </div>
    );
  }
}
