import React from 'react';
import { Calendar } from 'lucide-react';

interface EventNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EventNameInput: React.FC<EventNameInputProps> = ({
  value,
  onChange,
  placeholder = "New Event Name"
}) => {
  return (
    <div className="event-name-section">
      <div className="input-group">
        <Calendar className="input-icon" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="event-name-input"
        />
      </div>
    </div>
  );
};
