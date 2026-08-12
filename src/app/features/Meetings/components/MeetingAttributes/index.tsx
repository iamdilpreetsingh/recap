import type { MeetingAttributesProps } from "./MeetingAttributes.types";
import { getAttributeConfig } from "./MeetingAttributes.constants";

export default function MeetingAttributes({ meeting }: MeetingAttributesProps) {
  const attributes = getAttributeConfig(meeting);

  return (
    <div className="w-[200px] shrink-0 px-5 py-6 bg-white border-l border-neutral-100">
      <h2 className="text-xs font-semibold text-neutral-800 mb-5">
        Attributes
      </h2>

      <div className="space-y-5">
        {attributes.map(({ key, icon, label, value }) => (
          <div key={key} className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
              <p className="text-[10px] text-neutral-400 mb-0.5">{label}</p>
              {typeof value(meeting) === "string" ? (
                <p className="text-xs font-medium text-neutral-800">
                  {value(meeting)}
                </p>
              ) : (
                value(meeting)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
