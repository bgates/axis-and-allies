import React from 'react';
import ReactTooltip from 'react-tooltip';
import { UnitFigTableData } from '../../components/UnitFigure';

const disable = (selected, airUnits) => (
  Object.keys(selected).length !== airUnits.length || 
  Object.values(selected).filter(s => s).length !== airUnits.length
)

const LandPlanesModal = ({ 
  landingOptions, 
  airUnits, 
  territory, 
  selectedOptions,
  selectLandingOption,
  selectLandingTerritory
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
      <p>Select where each type of aircraft involved in combat in {territory.name} should land. Aircraft are grouped by type and origin territory.</p>
      <p>When you have made all of your selections, press the button at the bottom of this modal.</p>
      <table>
        <tbody>
          {airUnits.map(unit => (
            <LandingOptions 
              key={unit.options}
              unit={unit} 
              selected={selectedOptions[`${unit.name}-${unit.originName}`]}
              territoryIndex={territory.index}
              handleChange={selectLandingOption}
              options={landingOptions[unit.options]} />
          ))}
        </tbody>
      </table>
      <nav>
        <button 
          disabled={disable(selectedOptions, airUnits)}
          onClick={selectLandingTerritory}
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
        <select defaultValue={selected} onChange={e => handleChange(unit, territoryIndex, e.target.value)}>
          <option value="">select landing option</option>
          {options.map(territory => (
            <option 
              key={territory.index}
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
