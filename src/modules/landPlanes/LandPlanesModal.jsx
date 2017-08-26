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
  landPlanes 
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
        <p>When you are done choosing where aircraft from this campaign should land, press <button>ok</button></p>
      </ReactTooltip>
      <p>To land combat aircraft, select the desired landing territory's name. The aircraft are grouped by type and origin territory.</p>
      <table>
        <tbody>
          {airUnits.map(unit => (
            <LandingOptions 
              key={unit.options}
              unit={unit} 
              selected={selectedOptions[`${unit.name}-${unit.originName}`]}
              territoryIndex={territory.index}
              handleChange={landPlanes}
              options={landingOptions[unit.options]} />
          ))}
        </tbody>
      </table>
      <button disabled={disable(selectedOptions, airUnits)}>OK</button>
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
