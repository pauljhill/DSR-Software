# Equipment Template Project Notes

**NOTE: This document is incomplete and may not reflect the current implementation.**

1. **Objective**: Create individual PDF templates for each laser equipment model in equipment.csv

2. **Approach**:
   - Generate PDFs when equipment is added to database rather than for each show
   - Store generated PDFs in data/equipment-pdfs/ directory
   - When generating show PDFs, embed these pre-made equipment PDFs

3. **Equipment Template Structure**:
   - Basic equipment identification (ID, brand, model)
   - Technical specs (power output, NOHD, power draw)
   - Detailed laser component info with power, wavelength and divergence
   - Safety features (FB4, beam blocks)
   - Aviation safety zone measurements with explanations
   - Notes field

4. **Key Terminology Added**:
   - NOHD: Nominal Ocular Hazard Distance - safe viewing distance
   - Divergence: Beam spread rate measurement
   - FB4: Safety controller with scan-fail protection
   - Aviation zones (LSFZ, LCFZ, LFFZ) with explanations

5. **Next Steps**:
   - Create actual PDF template file
   - Implement PDF generation for each equipment item
   - Update show PDF generation to incorporate equipment PDFs
   - Test with real data

## Template Preview

```
Equipment Specification Sheet
---------------------------

ID: {id}
Brand: {brand}
Model: {model}

Technical Specifications:
• Total Power: {totalPower}mW (Combined power output of all laser sources)
• NOHD: {nohd}m (Nominal Ocular Hazard Distance - minimum safe viewing distance)
• Power Draw: {max_power_draw}W (Electrical power consumption)

Laser Components:
[Red]   {red_power_mw}mW at {red_wavelength_nm}nm - Divergence: {red_divergence_mrad}mrad
[Green] {green_power_mw}mW at {green_wavelength_nm}nm - Divergence: {green_divergence_mrad}mrad
[Blue]  {blue_power_mw}mW at {blue_wavelength_nm}nm - Divergence: {blue_divergence_mrad}mrad
(Divergence is the beam spread rate - lower values mean tighter beams)

Safety Features:
• FB4 Fitted: {fb4_fitted} (FB4 is a safety controller with scan-fail protection)
• Beam Block Fitted: {beam_block_fitted} (Physical device to block unsafe beam paths)

Aviation Safety Zones:
• LSFZ: Laser-beam Sensitive Flight Zone - area where flash-blindness or after-images may occur
• LCFZ: Laser-beam Critical Flight Zone - area where glare effects may occur 
• LFFZ: Laser-beam Free Flight Zone - area where any visual disruption must be prevented

Red:   LSFZ {red_lsfz}m | LCFZ {red_lcfz}m | LFFZ {red_lffz}m
Green: LSFZ {green_lsfz}m | LCFZ {green_lcfz}m | LFFZ {green_lffz}m
Blue:  LSFZ {blue_lsfz}m | LCFZ {blue_lcfz}m | LFFZ {blue_lffz}m

Notes:
{notes} 
```