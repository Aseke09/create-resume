import { useState, type ChangeEvent, type FC } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

interface InputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    label: string;
    placeholder: string;
    type: string;
    autoComplete?: string;
}

const Input: FC<InputProps> = ({ value, onChange, onBlur, label, placeholder, type, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }
  return (
    <div>
        <label className='text-[13px] text-slate-800'>{label}</label>
        
        <div className='input-box'>
            <input
                type={
                    type == 'password' ? (showPassword ? 'text' : 'password') : type
                }
                placeholder={placeholder}
                className='w-full bg-transparent outline-none'
                value={value}
                onChange={(e) => onChange(e)}
                onBlur={onBlur}
                autoComplete={autoComplete || 'off'}
            />

            {type === 'password' && (
                <>
                    {showPassword ? (
                        <FaRegEye
                        size={22}
                        className='text-primary cursor-pointer'
                        onClick={() => toggleShowPassword()}
                        />  
                    ) : (
                        <FaRegEyeSlash
                        size={22}
                        className='text-slate-400 cursor-pointer'
                        onClick={() => toggleShowPassword()}  
                        />
                    )}
                </>
            )}
        </div>
    </div>
  )
}

export default Input