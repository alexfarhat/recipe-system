import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { Instruction } from '../../types';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
interface InstructionEditorProps {
  instructions: Instruction[];
  onChange: (instructions: Instruction[]) => void;
}
export function InstructionEditor({
  instructions,
  onChange
}: InstructionEditorProps) {
  const addInstruction = () => {
    onChange([
    ...instructions,
    {
      id: `inst-${Date.now()}`,
      step: instructions.length + 1,
      text: ''
    }]
    );
  };
  const updateInstruction = (id: string, text: string) => {
    onChange(
      instructions.map((inst) =>
      inst.id === id ?
      {
        ...inst,
        text
      } :
      inst
      )
    );
  };
  const removeInstruction = (id: string) => {
    const filtered = instructions.filter((inst) => inst.id !== id);
    onChange(
      filtered.map((inst, index) => ({
        ...inst,
        step: index + 1
      }))
    );
  };
  return (
    <div className="space-y-3">
      {instructions.map((inst) =>
      <div key={inst.id} className="flex gap-3 items-start">
          <div className="flex-shrink-0 font-serif text-lg text-primary font-semibold w-8 pt-2">
            {String(inst.step).padStart(2, '0')}
          </div>
          <div className="flex-1">
            <Textarea
            placeholder="Describe this step..."
            value={inst.text}
            onChange={(e) => updateInstruction(inst.id, e.target.value)}
            rows={2} />
          
          </div>
          <button
          type="button"
          onClick={() => removeInstruction(inst.id)}
          className="p-2 text-text-muted hover:text-tomato transition-colors mt-1">
          
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      )}
      {instructions.length === 0 &&
      <p className="text-sm text-text-muted italic py-2">
          No instructions added yet.
        </p>
      }
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addInstruction}
        className="flex items-center gap-1.5 mt-3">
        
        <PlusIcon className="w-3.5 h-3.5" />
        Add Step
      </Button>
    </div>);

}