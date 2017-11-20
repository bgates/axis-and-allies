import React from 'react'
import ReactTooltip from 'react-tooltip'
import { UnitFigTableData } from '../../components/UnitFigure'

// selected is all of them.and the keys are objId. 
const disable = (selected, airUnits) => (
  airUnits.some(({ id })  => !selected[id])
)

const LandPlanesModal = ({ 
  landingOptions, 
  airUnits, 
  territory, 
  selectedOptions,
  selectLandingOption,
  landingThunk
}) => {
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Land Planes from {territory.name}</h1>
      <ReactTooltip place="bottom" type="info">
        <p>Aircraft cannot land in territories that were captured this turn.</p>
        <p>Aircraft that cannot land are lost and must be destroyed.</p>
        <p>Aircraft do not have to endure antiaircraft fire during this phase.</p>
        <hr/>
      </ReactTooltip>
      <p>Select where each type of aircraft involved in combat in {territory.name} should land.</p>
      <p>When you have made all of your selections, press the button at the bottom of this modal.</p>
      <table>
        <tbody>
          {airUnits.map(unit => (
            <LandingOptions 
              key={unit.id}
              unit={unit} 
              selected={selectedOptions[unit.id]}
              territoryIndex={territory.index}
              handleChange={selectLandingOption}
              options={landingOptions[unit.id]} />
          ))}
        </tbody>
      </table>
      <nav>
        <button 
          disabled={disable(selectedOptions, airUnits)}
          onClick={landingThunk}
        >OK</button>
      </nav>
    </div>
  )
}

const LandingOptions = ({ 
  unit, 
  options, 
  handleChange, 
  territoryIndex,
  selected
}) => {
  return (
    <tr>
      <UnitFigTableData unit={unit}/>
      <td>
        <select defaultValue={selected} onChange={e => handleChange(unit.id, e.target.value)}>
          <option key={unit.id * 100} value="">select landing option</option>
          {options.map(territory => (
            <option 
              key={`${territory.index}-${unit.id}`}
              value={territory.index}>
              {territory.name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  )
}
export default LandPlanesModal
