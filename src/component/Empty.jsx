const Empty = ({ title, description }) => {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-slate-300">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      ) : null}
    </div>
  );
};

export default Empty;
