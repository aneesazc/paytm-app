export function InputBox({label, type, placeholder, onChange}) {
    return <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
      <input onChange={onChange} type={type} placeholder={placeholder} className="border border-slate-200 rounded px-2 py-1 w-full" />
    </div>
}