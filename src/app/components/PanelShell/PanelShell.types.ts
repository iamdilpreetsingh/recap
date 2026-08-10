export interface PanelShellProps {
    isLive?: boolean
    sessionInfo?: string
    onMinimize?: () => void
    children: React.ReactNode
}
