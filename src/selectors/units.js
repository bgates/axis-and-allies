export const getAllUnits = state => state.units
export const getAllOutbound = state => state.outboundUnits
export const getAllInbound = state => state.inboundUnits

const match = unit1 => unit2 => (
  ['type', 'power', 'originName']
    .every(attr => unit1[attr] === unit2[attr])
)

export const combineUnits = (total, unit) => {
  let present = total.find(match(unit))
  if (present && unit.type !== 'transport') {
    return [ ...total.filter(u => u !== present), { ...present, ids: [...present.ids, unit.id], qty: present.qty + 1 } ]
  } else {
    return [ ...total, { ...unit, ids: [unit.id], qty: 1 } ]
  }
}


