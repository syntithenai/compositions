import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import {useRef} from 'react'


class OpenSheetMusicDisplay extends Component {
    constructor(props) {
      super(props);
      this.state = { dataReady: false };
      this.osmd = undefined;
      this.divRef = React.createRef();
      //this.rendered = useRef();
      this.isRendered = React.createRef(false)
    }
  
    setupOsmd() {
		if (this.props.file) {
		  const options = {
			autoResize: this.props.autoResize !== undefined ? this.props.autoResize : true,
			drawTitle: this.props.drawTitle !== undefined ? this.props.drawTitle : true,
		  }
		  this.osmd = new OSMD(this.divRef.current, options);
		  console.log(this.osmd)
		  this.osmd.load(this.props.file).then(() => {
			  console.log('loaded',this.isRendered)
			  if (!this.isRendered.current) {
				  console.log('render')
				  
				  try {
					this.osmd.render()
					this.isRendered.current = true
				  } catch (e) {
					  console.log(e)
					  
				  }
				  
			  }
		  });
		}
    }
  
    //resize() {
      ////this.forceUpdate();
    //}
  
    //componentWillUnmount() {
      //window.removeEventListener('resize', this.resize)
    //}
  
    //componentDidUpdate(prevProps) {
      //if (this.props.drawTitle !== prevProps.drawTitle) {
        //this.setupOsmd();
      //} else if (this.props.file) {
        //this.osmd.load(this.props.file).then(() => this.osmd.render());
      //}
      ////window.addEventListener('resize', this.resize)
    //}
  
    // Called after render
    componentDidMount() {
      this.setupOsmd();
    }
  
    render() {
      return (<div ref={this.divRef} />);
    }
  }

  export default OpenSheetMusicDisplay;

