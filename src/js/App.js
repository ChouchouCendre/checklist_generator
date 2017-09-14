import React from 'react';
import PropTypes from 'prop-types';
import Json from '@json/checklist_fr.json';
import JsonEn from '@json/checklist_en.json';
import IconUK from '@svg/uk.svg';
import Labels from '@json/labels.json';
import Composition from './containers/composition';
import Checklist from './containers/checklist';
import Header from './containers/header';

require('@scss/style.scss');
require('@scss/info.scss');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.lang = this.getLanguage();
    this.state = {
      familyComposition: props.family || [],
      familyOptions: props.options || {},
      json: props.json || this.lang === 'fr' ? Json : JsonEn,
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdateOptions = this.onUpdateOptions.bind(this);
    this.onUpdateJson = this.onUpdateJson.bind(this);
    this.defaultJson = this.lang === 'fr' ? Json : JsonEn;
  }

  componentDidMount() {
    const myList = localStorage.getItem('chouchouList');
    if (myList) {
      this.setState({ json: JSON.parse(myList) });
    }
    const myFamily = localStorage.getItem('chouchouFamily');
    if (myFamily) {
      this.setState({ familyComposition: JSON.parse(myFamily) });
    }
    if (myList && myFamily) {
      this.clickGenerate();
    }
    if (this.lang === 'en') document.querySelector('.lang').classList.add('hide');
  }

  onUpdate(newFamily) {
    this.setState({ familyComposition: newFamily });
  }

  onUpdateOptions(newOptions) {
    this.setState({ familyOptions: newOptions });
  }

  onUpdateJson(newJson) {
    localStorage.setItem('chouchouList', JSON.stringify(newJson));
    localStorage.setItem('chouchouFamily', JSON.stringify(this.state.familyComposition));
    this.setState({ json: newJson });
  }

  clickGenerate() {
    const contList = document.querySelector('.contList');
    contList.style.maxHeight = '5000px';
    contList.style.opacity = '1';

    const contFamily = document.querySelector('.contFamily');
    contFamily.style.maxHeight = '0';
  }

  clickPrint() {
    window.print();
  }

  clickBack() {
    const contList = document.querySelector('.contList');
    const contFamily = document.querySelector('.contFamily');
    contList.style.maxHeight = '0';
    contList.style.opacity = '0';
    contFamily.style.maxHeight = '1000px';
    localStorage.clear();
    this.onUpdateJson(this.defaultJson);
  }

  getLanguage() {
    let lang = window.location.href.split('?lang=')[1];
    if (!lang) lang = 'fr';
    return lang;
  }

  createMarkup() {
    return { __html: Labels[this.lang]['mentions'] };
  }

  clickFlag() {
    if (window.location.href.indexOf('localhost') !== -1) {
      window.location.href = 'http://localhost:3000/?lang=en';
    } else {
      window.location.href = 'http://www.lesaventuresduchouchou.com/content/checklist/?lang=en';
    }
  }

  render() {
    return (
      <div>
          <Header subtitle={ Labels[this.lang]['subtitle'] } />
          <div className="lang printHide" onClick={ this.clickFlag } ><IconUK /></div>
          <div className="contFamily">
            <h2 className="printHide">{ Labels[this.lang]['title'] }</h2>
            <Composition onUpdate={this.onUpdate} onUpdateOptions={this.onUpdateOptions} lang={this.lang} />
            <div className="familyButtons printHide">
              <button type="submit" onClick={this.clickGenerate}>{ Labels[this.lang]['generate'] }</button><br />
            </div>
          </div>
          <div className="contList">
            <h2>{ Labels[this.lang]['checklist'] }</h2>
            <div className="listButtons">
              <button type="submit" onClick={this.clickBack.bind(this)}>← { Labels[this.lang]['regenerate'] }</button>
            </div>
            <Checklist family={this.state.familyComposition} options={this.state.familyOptions} json={this.state.json} onUpdate={this.onUpdateJson} lang={this.lang} />
            <div className="buttons printHide">
              <button type="submit" onClick={this.clickPrint}>{ Labels[this.lang]['print'] }</button><br />
            </div>
          </div>
          <div className="mentions" dangerouslySetInnerHTML={ this.createMarkup() }></div>
          <div className="freepik">Icons made by <a href="http://www.flaticon.com/authors/freepik" title="Freepik" target="_blank" rel="nofollow">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon" target="_blank" rel="nofollow">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="nofollow">CC 3.0 BY</a><br /><a href="https://github.com/ChouchouCendre/checklist_generator" target="_blank">GITHUB</a> | <a href="http://www.lesaventuresduchouchou.com/contactez-moi/" target="_blank">{ Labels[this.lang]['reportBug'] }</a></div>
      </div>
    );
  }
}

App.propTypes = {
  familyComposition: PropTypes.array,
  familyOptions: PropTypes.object,
  json: PropTypes.object,
}

export default App;
