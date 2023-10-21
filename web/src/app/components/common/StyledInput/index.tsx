import './index.scss';

type StyleInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isValid?: boolean;
    title: string;
    placeholder?: string;
    id?: string;
    autoComplete?: string;
    required?: boolean;
    type?: string;
};

export const StyledInput: React.FC<StyleInputProps> = ({
    value,
    onChange,
    isValid = true,
    title,
    placeholder = '',
    id = '',
    autoComplete = 'off',
    required = false,
    type = 'text',
}) =>
    <div className="styled-input">
        <label className="styled-input__label">{title}</label>
        <input
            className={`styled-input__input styled-input__input${isValid ? '' : '--not-valid'}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type={type}
            id={id}
            autoComplete={autoComplete}
            required={required}
        />
        <span />
    </div>;
