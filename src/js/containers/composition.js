import React from 'react';
import IconSun from '@svg/sun.svg';
import IconWater from '@svg/water.svg';
import IconCold from '@svg/snowflake.svg';
import IconSki from '@svg/ski.svg';
import IconLocation from '@svg/home.svg';
import IconBreast from '@svg/breast.svg';
import IconCar from '@svg/car.svg';
import Labels from '@json/labels.json';

const family = [
  {
    id: 0,
    name: 'man',
    thumbnail: 'assets/superman.jpg',
    value: 0,
  },
  {
    id: 1,
    name: 'woman',
    thumbnail: 'assets/wonderwoman.jpg',
    value: 0,
  },
  {
    id: 2,
    name: 'child',
    thumbnail: 'assets/children.jpg',
    value: 0,
  },
  {
    id: 3,
    name: 'baby',
    thumbnail: 'assets/baby.jpg',
    value: 0,
  },
]

const options = {
  sun: false,
  water: false,
  cold: false,
  ski: false,
  location: false,
  breast: false,
}

export default class Composition extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    for (let i = 0; i < family.length; i += 1) {
      family[i].info = Labels[this.props.lang].genders[i];
    }
    this.props.onUpdate(family);
  }

  handleChange (event) {
    const newFamily = family;
    newFamily[event.target.getAttribute('id')].value = event.target.value;
    this.props.onUpdate(newFamily);
  }

  handleChangeCheck(event) {
    const newOptions = options;
    newOptions[event.target.getAttribute('value')] = event.target.checked;
    this.props.onUpdateOptions(newOptions);
  }

  renderList () {
    return family.map((member) => {
      return (
        <li key={ member.id }>
          <img src={ member.thumbnail } />
          <span>x</span>
          <select id={ member.id } onChange={ this.handleChange } defaultValue="0">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          </select>
          <div className="composition-legend">{ member.info }</div>
        </li>
      )
    })
  }

  renderOptions () {
    // l'id semble inutile...
    const optionsMap = [
      { id: 0, type: 'sun', name: Labels[this.props.lang].sun, icon: IconSun },
      { id: 1, type: 'water', name: Labels[this.props.lang].water, icon: IconWater },
      { id: 2, type: 'cold', name: Labels[this.props.lang].cold, icon: IconCold },
      { id: 3, type: 'ski', name: Labels[this.props.lang].ski, icon: IconSki },
      { id: 4, type: 'location', name: Labels[this.props.lang].location, icon: IconLocation },
      { id: 5, type: 'breast', name: Labels[this.props.lang].breast, icon: IconBreast },
      { id: 6, type: 'car', name: Labels[this.props.lang].car, icon: IconCar },
    ]
    // ...car la méthode "map" prend en second paramètre l'index de la boucle
    const elements = optionsMap.map((option) => {
      const Icon = option.icon;
      return (
        <label key={option.id}>
          <input type="checkbox" value={option.type} onChange={this.handleChangeCheck.bind(this)} />
          <Icon /><span>{option.name}</span>
        </label>
      )
    })
    return elements
  }

  render () {
    return (
      <div className="printHide">
        <ul className="composition">
            {this.renderList()}
        </ul>
        <h2 className="printHide">{ Labels[this.props.lang].options }</h2>
        <form className="options">
            {this.renderOptions()}
        </form>
      </div>
    )
  }
}
