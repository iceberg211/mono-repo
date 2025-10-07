import { useState, useCallback } from "react";
import { BrowserProvider, Contract, ContractTransactionResponse } from "ethers";

// 标准 ERC20 Approve 方法 ABI
const ERC20_APPROVE_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
];

/**
 * Token 授权参数
 */
export interface UseTokenApproveOptions {
  tokenAddress?: string;
  spenderAddress?: string;
  provider?: BrowserProvider | null;
}

/**
 * Token 授权状态
 */
export interface TokenApproveState {
  data: ContractTransactionResponse | null;
  isLoading: boolean;
  error: Error | null;
  approve: (amount: bigint) => Promise<ContractTransactionResponse | null>;
  approveAsync: (amount: bigint) => Promise<ContractTransactionResponse>;
  checkAllowance: () => Promise<bigint | null>;
}

/**
 * Token 授权 Hook
 *
 * @example
 * ```tsx
 * const { approve, isLoading, checkAllowance } = useTokenApprove({
 *   tokenAddress: '0x...',
 *   spenderAddress: '0x...',
 *   provider
 * });
 *
 * const handleApprove = async () => {
 *   const amount = BigInt('1000000000000000000'); // 1 token
 *   await approve(amount);
 * };
 *
 * return (
 *   <button onClick={handleApprove} disabled={isLoading}>
 *     {isLoading ? '授权中...' : '授权 Token'}
 *   </button>
 * );
 * ```
 */
export function useTokenApprove(options: UseTokenApproveOptions = {}): TokenApproveState {
  const { tokenAddress, spenderAddress, provider } = options;

  const [state, setState] = useState<
    Omit<TokenApproveState, "approve" | "approveAsync" | "checkAllowance">
  >({
    data: null,
    isLoading: false,
    error: null,
  });

  const checkAllowance = useCallback(async (): Promise<bigint | null> => {
    if (!tokenAddress || !spenderAddress || !provider) {
      return null;
    }

    try {
      const signer = await provider.getSigner();
      const ownerAddress = await signer.getAddress();
      const contract = new Contract(tokenAddress, ERC20_APPROVE_ABI, provider);
      const allowance = await contract.allowance(ownerAddress, spenderAddress);
      return allowance;
    } catch (error) {
      console.error("Check allowance error:", error);
      return null;
    }
  }, [tokenAddress, spenderAddress, provider]);

  const approveAsync = useCallback(
    async (amount: bigint): Promise<ContractTransactionResponse> => {
      if (!tokenAddress || !spenderAddress || !provider) {
        throw new Error("缺少必要参数");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const signer = await provider.getSigner();
        const contract = new Contract(tokenAddress, ERC20_APPROVE_ABI, signer);
        const tx = await contract.approve(spenderAddress, amount);

        setState({ data: tx, isLoading: false, error: null });
        return tx;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Token 授权失败");
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
        throw err;
      }
    },
    [tokenAddress, spenderAddress, provider]
  );

  const approve = useCallback(
    async (amount: bigint): Promise<ContractTransactionResponse | null> => {
      try {
        return await approveAsync(amount);
      } catch (error) {
        console.error("Token approve error:", error);
        return null;
      }
    },
    [approveAsync]
  );

  return {
    ...state,
    approve,
    approveAsync,
    checkAllowance,
  };
}
