import React from 'react'
import IconMore from '../../svg/more.svg';
import IconLess from '../../svg/less.svg';
import IconInfo from '../../svg/info.svg';
import IconEdit from '../../svg/edit.svg';
import IconValid from '../../svg/valid.svg';
import IconDelete from '../../svg/delete.svg';
import IconLine from '../../svg/line.svg';
import Labels from '../../json/labels.json';

const shortid = require('shortid');

let newElement = 'New element';

export default class Checklist extends React.Component {

  constructor(props) {
    super(props);
    newElement = Labels[this.props.lang].newElement;
  }

  componentDidUpdate() {
    if (this.currentSelect) {
      const group = document.querySelector('[data-id="' + this.currentSelect[0] + '"]');
      if (this.currentSelect[1] !== -1) {
        const line = group.querySelector('[data-sid="' + this.currentSelect[1] + '"]');
        line.classList.add('line--edit');
      } else {
        const line = group.querySelectorAll('[data-sid]');
        line[line.length - 1].classList.add('line--edit');
      }
      this.currentSelect = null;
    }
    let tmpWidth = 0;
    const nbMembers = this.props.family.length;
    for (let i = 0; i < nbMembers; i += 1) {
      tmpWidth += this.props.family[i].value * 101;
    }
    if (window.screen.width <= 600) tmpWidth = 60;
    const uniques = document.querySelectorAll('.case--unique');
    for (let i = 0; i < uniques.length; i += 1) {
      uniques[i].style.width = tmpWidth + 'px';
    }
  }

  clickCase(e) {
    const casee = e.currentTarget;
    if (!casee.classList.contains('active')) {
      casee.classList.add('active');
    } else {
      casee.classList.remove('active');
    }
  }

  renderFamily () {
    const indents = []
    // myArray = ''
    this.cases = [];
    this.props.family.forEach((user) => {
      for (let i = 0; i < user.value; i += 1) {
        indents.push(user)
        // myArray += '<div class="case case--' + user.name + '" onClick={ this.clickCase }></div>'
        this.cases.push(user.name);
      }
    })
    return (
        <div className="family">
        {indents.map((item, index) => (
            <div className='indent' key={index}><img src={item.thumbnail} /></div>
        ))}
        </div>
    )
  }

  lineOver (e) {
    if (window.screen.width <= 600) return;
    const currentLine = e.currentTarget;
    const edit = currentLine.querySelector('.edit');
    edit.classList.remove('hide');
    const del = currentLine.querySelector('.delete');
    del.classList.remove('hide');
  }

  lineOut (e) {
    if (window.screen.width <= 600) return;
    const currentLine = e.currentTarget;
    if (currentLine.classList.contains('line--edit')) return;
    const edit = currentLine.querySelector('.edit');
    edit.classList.add('hide');
    const del = currentLine.querySelector('.delete');
    del.classList.add('hide');
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.clickEdit(e);
    }
  }

  handleBlur(e) {
    this.clickEdit(e);
  }

  handleBlurRoom(e) {
    this.clickEditRoom(e);
  }

  onChangeInput() {
    // Weird issue with defaultValue!
  }

  handleFocus(e) {
    if (e.currentTarget.value === newElement) e.currentTarget.value = '';
  }

  clickEdit(e) {
    const edit = e.currentTarget;
    const currentLine = edit.closest('.line');
    if (!currentLine.classList.contains('line--edit')) {
      currentLine.classList.add('line--edit');
    } else {
      if (e.currentTarget.value === '') e.currentTarget.value = newElement;
      const id = currentLine.parentNode.getAttribute('data-id');
      const sid = currentLine.getAttribute('data-sid');
      const newJson = this.props.json;
      newJson[id].items[sid].name = currentLine.querySelector('.label input').value;
      this.props.onUpdate(newJson);
    }
  }

  clickEditRoom(e) {
    const input = e.currentTarget;
    const id = input.parentNode.parentNode.getAttribute('data-id');
    const newJson = this.props.json;
    newJson[id].room = input.value;
    this.props.onUpdate(newJson);
  }

  deleteLine (e) {
    const id = e.currentTarget.parentNode.parentNode.getAttribute('data-id');
    const sid = e.currentTarget.parentNode.getAttribute('data-sid');
    const newJson = this.props.json;
    newJson[id].items.splice(sid, 1);
    this.props.onUpdate(newJson);
  }

  onChangeSelect (e) {
    const currentLine = e.target.closest('.line');
    const id = currentLine.parentNode.getAttribute('data-id');
    const sid = currentLine.getAttribute('data-sid');
    const newJson = this.props.json;
    newJson[id].items[sid].name = currentLine.querySelector('.label input').value;
    newJson[id].items[sid].type = e.target.value;
    this.currentSelect = [id, sid];
    this.props.onUpdate(newJson);
  }

  getNewLine () {
    return (
      <div className='line line--all' onMouseOver={ this.lineOver } onMouseOut={ this.lineOut }></div>
    )
  }

  addLine (e) {
    const id = e.currentTarget.parentNode.getAttribute('data-id');
    const newJson = this.props.json;
    newJson[id].items.push(
      {
        name: newElement,
        type: 'all',
      });
    this.currentSelect = [id, -1];
    this.props.onUpdate(newJson);
  }

  showMore (e) {
    const moreLink = e.currentTarget;
    if (!moreLink.classList.contains('active')) {
      moreLink.classList.add('active');
    } else {
      moreLink.classList.remove('active');
    }
    const more = moreLink.parentNode.querySelector('.more');
    if (!more.classList.contains('hide')) {
      more.classList.add('hide');
    } else {
      more.classList.remove('hide');
    }
  }

  checkExist (array, search) {
    if (array.indexOf(search) !== -1) {
      return true
    } else {
      return false
    }
  }

  checkOptions (options) {
    let tmpBool = false;
    for (let i = 0; i < options.length; i += 1) {
      if (this.props.options[options[i]]) tmpBool = true;
    }
    return tmpBool;
  }

  checkOptionsStrict (options) {
    for (let i = 0; i < options.length; i += 1) {
      if (!this.props.options[options[i]]) return false;
    }
    return true;
  }

  addRoom () {
    const newJson = this.props.json;
    newJson.push({
      room: Labels[this.props.lang].newRoom,
      id: newJson.length,
      items: [
        {
          name: Labels[this.props.lang].newElement,
          type: 'all',
        },
      ],
    });
    this.currentSelect = [newJson.length - 1, -1];
    this.props.onUpdate(newJson);
  }

  makeUnique () {
    const newJson = this.props.json;
    newJson.forEach(function each(data) {
      for (let i = 0; i < data.items.length; i += 1) {
        const item = data.items[i];
        item.type = 'unique';
      }
    });
    this.props.onUpdate(newJson);
  }

  goArticle() {
    window.open('http://www.lesaventuresduchouchou.com'); // TODO
  }

  renderSelect(item) {
    const hasMan = this.props.family[0].value > 0;
    const hasWoman = this.props.family[1].value > 0;
    const hasChild = this.props.family[2].value > 0;
    const hasBaby = this.props.family[3].value > 0;
    return (
      <select defaultValue={item.type} className="hide" onChange={ this.onChangeSelect.bind(this) }>
        <option value="all">{ Labels[this.props.lang].wholeFamily }</option>
        { hasMan ? <option value="man">{ Labels[this.props.lang].onlyMan }</option> : '' }
        { hasWoman ? <option value="woman">{ Labels[this.props.lang].onlyWoman }</option> : '' }
        { hasChild ? <option value="child">{ Labels[this.props.lang].onlyChild }</option> : '' }
        { hasChild && hasBaby ? <option value="child_baby">{ Labels[this.props.lang].childBaby }</option> : '' }
        { hasBaby ? <option value="baby">{ Labels[this.props.lang].onlyBaby }</option> : '' }
        { hasBaby ? <option value="adult_child">{ Labels[this.props.lang].allButBaby }</option> : '' }
        <option value="unique">{ Labels[this.props.lang].unique }</option>
      </select>
    );
  }

  renderLabel(item) {
    if (!item.info) {
      return (
          <div className="label">
            <span dangerouslySetInnerHTML={{ __html: item.name }}></span>
            <span><input type="text" defaultValue={ item.name } onKeyPress={ this.handleKeyPress.bind(this) } onFocus={ this.handleFocus.bind(this) } onBlur={ this.handleBlur.bind(this) } /></span>
            { this.renderSelect(item) }
          </div>
      );
    } else {
      return (
        <div className="label">
          <span>{ item.name }</span>
          <span><input type="text" defaultValue={ item.name } onKeyPress={ this.handleKeyPress.bind(this) } /></span>
          <span className="info printHide">
            { item.info.link ? <a href={ item.info.link } target="_blank" rel="nofollow"><dfn data-info={ item.info.text + ' ' + Labels[this.props.lang].clickMore }><IconInfo /></dfn></a> : <dfn data-info={ item.info.text }><IconInfo /></dfn> }
          </span>
        { this.renderSelect(item) }
        </div>
      );
    }
  }

  renderCases(type) {
    if (type === 'unique') {
      return (
        <div className='case case--unique' onClick={ this.clickCase } key={ shortid.generate() }></div>
      );
    }
    return (
      this.cases.map((item3) => (
        <div className={'case case--' + item3} onClick={ this.clickCase } key={ shortid.generate() }></div>
      ))
    )
  }

  checkItem (item) {
    const hasMan = this.props.family[0].value > 0;
    const hasWoman = this.props.family[1].value > 0;
    const hasChild = this.props.family[2].value > 0;
    const hasBaby = this.props.family[3].value > 0;
    let isValid = true;
    if (item.type === 'man' && !hasMan) isValid = false;
    if (item.type === 'woman' && !hasWoman) isValid = false;
    if (item.type === 'baby' && !hasBaby) isValid = false;
    if (item.type === 'child_baby' && !hasChild && !hasBaby) isValid = false;
    if (item.options && this.checkOptions(item.options) === false) isValid = false;
    if (item.optionsStrict && this.checkOptionsStrict(item.options) === false) isValid = false;
    return isValid;
  }

  renderMore(le) {
    if (le !== 0) {
      return (
        <div className="moreLink printHide" onClick={ this.showMore }>
          <span><IconMore /> { Labels[this.props.lang].view } { le } { Labels[this.props.lang].more }</span>
          <span><IconLess /> { Labels[this.props.lang].view } { Labels[this.props.lang].less }</span>
        </div>
      )
    } else {
      return (
        <div className="moreLink printHide"></div>
      );
    }
  }

  renderList () {
    const newDatas = [];

    this.props.json.forEach(function each(data) {
      const tmpItems = [];
      const tmpItemsMore = [];
      for (let i = 0; i < data.items.length; i += 1) {
        const item = data.items[i];
        item.id = i;
        const check = this.checkItem(item);
        if (!item.more) {
          if (check) tmpItems.push(item);
        } else {
          if (check) tmpItemsMore.push(item);
        }
      }
      if (data.options && !this.checkOptions(data.options)) return;
      newDatas.push({
        room: data.room,
        id: data.id,
        items: tmpItems,
        itemsMore: tmpItemsMore,
      });
    }.bind(this));

    return (
      <div>
      {newDatas.map((data, index) => (
          <div key={ index } data-id={ data.id }>
            <div className="list-room"><input type="text" value={ data.room } onChange={ this.onChangeInput } onBlur={ this.handleBlurRoom.bind(this) } /></div>
            {data.items.map((item) => (
              <div className={'line line--' + item.type} key={shortid.generate()} data-sid={ item.id } onMouseOver={ this.lineOver } onMouseOut={ this.lineOut }>
              { this.renderLabel(item) }
              <span className="edit hide" onClick={ this.clickEdit.bind(this) }><IconEdit /><IconValid /></span>
              <span className="delete hide" onClick={ this.deleteLine.bind(this) }><IconDelete /></span>
              <div className="cases">
              { this.renderCases(item.type) }
              </div>
              </div>
            ))}
            <div className="moreLink addLine printHide" onClick={ this.addLine.bind(this) }>
              <span><IconLine /> { Labels[this.props.lang].addLine }</span>
            </div>
            { this.renderMore(data.itemsMore.length) }
            <div className="more hide">
              {data.itemsMore.map((item2) => (
                <div className={'line line--more line--' + item2.type} key={item2.name}>
                { this.renderLabel(item2) }
                <div className="cases">
                  { this.renderCases(item2.type) }
                </div>
              </div>
              ))}
            </div>
          </div>
      ))}
      </div>
    );
  }

  render () {
    if (this.props.family.length === 0) {
      return (<div>Compose your family...</div>)
    }
    return (
        <div className="list">
          {this.renderFamily()}
          {this.renderList()}
          <div className="listButtons">
            <button type="submit" onClick={this.addRoom.bind(this)}>{ Labels[this.props.lang].addRoom }</button>
            <button type="submit" onClick={this.makeUnique.bind(this)}>{ Labels[this.props.lang].caseUnique }</button>
            <button type="submit" className="buttonArticle" onClick={this.goArticle.bind(this)}>{ Labels[this.props.lang].seeArticle }</button>
          </div>
        </div>
    )
  }
}
