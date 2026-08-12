type MeetingProps = {
  color?: string;
};

export default function Meeting({ color = "#6C47FF" }: MeetingProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
      <rect x="2" y="10" width="24" height="20" rx="4" fill={color} />
      <path d="M26 16l10-6v20l-10-6V16z" fill={color} />
    </svg>
  );
}
