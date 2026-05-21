import * as Icons from './Icons'

type AppLogoProps = {
  size?: 'sm' | 'lg'
}

const AppLogo = ({ size = 'lg' }: AppLogoProps) => {
  const isSmall = size === 'sm'

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={[
          'flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700',
          isSmall
            ? 'h-8 w-8 rounded-lg shadow-sm shadow-blue-600/40'
            : 'h-9 w-9 rounded-xl shadow-md shadow-blue-600/30',
        ].join(' ')}
      >
        <Icons.TrendingUp
          className={[
            'text-white stroke-[2.5]',
            isSmall ? 'h-4 w-4' : 'h-5 w-5',
          ].join(' ')}
        />
      </div>
      <span
        className={[
          'font-bold tracking-tight text-slate-900',
          isSmall ? 'text-[17px]' : 'text-[20px]',
        ].join(' ')}
      >
        Lead<span className="text-blue-600">Flow</span>
      </span>
    </div>
  )
}

export default AppLogo
