import React from 'react';
import '../../../styles/PlayGround/MemoTest.scss';
import swal from 'sweetalert';
import axios from 'axios';
import umalogo from '../../../assets/logo.png';
import {games} from '../../../config/endpoints';
// import {GenericHeader} from '../../GeneralComponents/Headers';

class PlayGround extends React.Component {
  constructor(props) {
      super(props)
      const initialState = {
          frameworks: [
              'https://www.cdc.gov/coronavirus/2019-ncov/images/protect-wash-hands.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/protect-quarantine.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/prevent-getting-sick/cloth-face-cover.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/COVIDweb_09_clean.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/COVIDweb_06_coverCough.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/COVIDweb_avoidCloseContact_masks_rect-01.png',
              'https://espanol.cdc.gov/coronavirus/2019-ncov/images/COVIDweb_04_CallDoc.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/COVIDweb_05_mask.png',
              'https://www.cdc.gov/coronavirus/2019-ncov/images/COVIDweb_08_DontShare.png',
              umalogo
          ],
          duplicatedFrameworks: [],
          randomizedFrameworks: [],
          finalizedFrameworks: [],
          openedFrameworks: []
        }
      this.state = initialState
      this.start()
  }

  handleClick(name,index){
    if(this.state.openedFrameworks.length === 2){
      setTimeout(() => {
        this.check()
      },750)
      let data = {
        'path':'assignations/online_clinica_medica/bag-test/2020-03-29_15-29-16-229271'
      }
      let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': localStorage.getItem('token')  */}
      axios.post(games, data, headers)
    } else {
      let framework = {
        name,
        index
      }
      let finalizedFrameworks = this.state.finalizedFrameworks
      let frameworks = this.state.openedFrameworks
      finalizedFrameworks[index].close = false
      frameworks.push(framework)
      this.setState({
        openedFrameworks: frameworks,
        finalizedFrameworks: finalizedFrameworks
      })
      if(this.state.openedFrameworks.length === 2){
        setTimeout(() => {
          this.check()
        },750)
      }
    }
  } 

  check(){
    let finalizedFrameworks = this.state.finalizedFrameworks
    if(this.state.openedFrameworks[0] && 
        ((this.state.openedFrameworks[0].name === this.state.openedFrameworks[1].name) 
        && (this.state.openedFrameworks[0].index !== this.state.openedFrameworks[1].index))){
      finalizedFrameworks[this.state.openedFrameworks[0].index].complete = true
      finalizedFrameworks[this.state.openedFrameworks[1].index].complete = true
    } else if(this.state.openedFrameworks[0]) {
      finalizedFrameworks[this.state.openedFrameworks[0].index].close = true
      finalizedFrameworks[this.state.openedFrameworks[1].index].close = true
    }
    this.setState({
      finalizedFrameworks,
      openedFrameworks: []
    })
    let toFinish = finalizedFrameworks.filter((el) => {
        if(el.complete === true) return el
    })
    if(toFinish.length === 20) {
        swal({
            title: "Muy bien!",
            text: "¿Deseas jugar nuevamente?",
            icon: "success",
            buttons: true,
            dangerMode: false,
          })
          .then((yeah) => {
            if (yeah) {
                this.setState(this.initialState)
                this.start()
            } else {
                alert("Seguimos esperando...")
            }
          });
    }
  }

  start(){
    let finalizedFrameworks = [];
    this.state.duplicatedFrameworks = this.state.frameworks.concat(this.state.frameworks)
    this.state.randomizedFrameworks = this.shuffle(this.state.duplicatedFrameworks)
    this.state.randomizedFrameworks.map((name,index) => {
      finalizedFrameworks.push({
        name,
        close: true,
        complete: false,
        fail: false
      })
    })
    this.state.finalizedFrameworks = finalizedFrameworks
  }

  shuffle(array){
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array
  }

  render(){
    return (
      <>
        {/* <GenericHeader /> */}
        <div id="memo">
          <div className="playground">
              {
                this.state.finalizedFrameworks.map((framework, index) => {
                  return <Card framework={framework.name} click={() => {this.handleClick(framework.name,index)}} close={framework.close} complete={framework.complete} key={index} />
                })
              }
          </div>
        </div>
      </>
    )
  }
}
  
class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    
    }
  }

  clicked(framework){
    this.props.click(framework)
  }

  render(){
    return (
      <div 
        className={"card" + (!this.props.close ? ' opened' : '') + (this.props.complete ? ' matched' : '')} 
        onClick={() => this.clicked(this.props.framework)}
      >
        <div className="front">
          ?
        </div>
        <div className="back">
          <img src={this.props.framework} alt=""/>
        </div>
      </div>
    )
  }
}

export default PlayGround;