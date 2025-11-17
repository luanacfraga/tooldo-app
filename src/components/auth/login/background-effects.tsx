export function BackgroundEffects() {
  return (
    <>
      <div className="from-primary/8 to-secondary/8 absolute inset-0 bg-gradient-to-b via-background via-50% lg:hidden"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent lg:hidden"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent lg:hidden"></div>

      <div className="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/15 opacity-40 blur-[100px] lg:hidden"></div>
      <div className="animate-blob animation-delay-2000 absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/15 opacity-40 blur-[120px] lg:hidden"></div>
      <div className="animate-blob animation-delay-4000 absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-primary/10 opacity-30 blur-[80px] lg:hidden"></div>
      <div className="animate-blob animation-delay-3000 bg-secondary/12 absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full opacity-25 blur-[90px] lg:hidden"></div>
    </>
  )
}
