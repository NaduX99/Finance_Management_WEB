import DotField from './DotField'

export default function AuthDotBackground() {
  return (
    <div className="auth-dot-field">
      <DotField
        dotRadius={1.5}
        dotSpacing={17}
        bulgeStrength={82}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        cursorRadius={350}
        cursorForce={0.13}
        bulgeOnly
        gradientFrom="#11e915"
        gradientTo="#2a742a"
        glowColor="#120F17"
      />
    </div>
  )
}
