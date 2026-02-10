import { useAuth } from '../contexts/AuthContext';

const Greeting = () => {
  const { profile } = useAuth();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="text-center">
        <p className="text-mood-blue-600 text-[24px]/[1.3] md:text-[32px]/[1.4] tracking-[-0.3px] font-bold mb-2.5">
          Hello {profile?.name || 'there'}!
        </p>
        <h1 className="text-[46px]/[1.2] md:text-[52px]/[1.4] tracking-[-2px] font-bold  mb-2.5">
          How are you feeling today?
        </h1>
        <p className="text-mood-neutral-600 text-[18px]/[1.2]">{today}</p>
      </div>
    </>
  );
};

export default Greeting;
