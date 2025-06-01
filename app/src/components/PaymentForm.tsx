import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { HowItWorks } from "@/components/HowItWorks";
import { Send, University, DollarSign, FileText } from "lucide-react";
import { useDeposit } from "@/hooks/useDeposit";
import { universitiesList } from "@/constants/universities";

interface PaymentFormProps {
	account: string | null;
}

export const PaymentForm = ({ account }: PaymentFormProps) => {
	const [selectedUniversity, setSelectedUniversity] = useState<string>("");
	const [amount, setAmount] = useState<string>("");
	const [invoiceRef, setInvoiceRef] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const { mutation: deposit } = useDeposit();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedUniversity || !amount || !invoiceRef) {
			toast({
				title: "Missing Information",
				description: "Please fill in all required fields",
				variant: "destructive",
			});
			return;
		}

		const university = universitiesList.find(
			(u) => u.id === selectedUniversity
		);
		if (!university) return;

		setIsLoading(true);

		try {
			console.log("Payment Details:", {
				payer: account,
				university: university.address,
				amount: amount,
				invoiceRef: invoiceRef,
			});

			deposit.mutate(
				{
					university: university.address,
					amount: amount,
					invoiceRef: invoiceRef,
				},
				{
					onSuccess() {
						toast({
							title: "Deposited successfully",
							description: `Payment of ${amount} USDC to ${university.name} has been deposited. Transaction is being processed.`,
						});
					},
					onError(error) {
						toast({
							title: "Error",
							description: error.message,
						});
					},
				}
			);

			// Reset form
			setSelectedUniversity("");
			setAmount("");
			setInvoiceRef("");
		} catch (error) {
			console.error("Payment error:", error);
			toast({
				title: "Payment Failed",
				description:
					"There was an error processing your payment. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const selectedUniversityData = universitiesList.find(
		(u) => u.id === selectedUniversity
	);

	return (
		<div className="grid md:grid-cols-2 gap-6">
			<Card className="border border-gray-200 dark:border-gray-700 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
						<Send className="h-5 w-5" />
						<span>Payment Details</span>
					</CardTitle>
					<CardDescription className="text-gray-600 dark:text-gray-300">
						Enter the details for your tuition payment
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label
								htmlFor="university"
								className="text-gray-900 dark:text-white"
							>
								University *
							</Label>
							<Select
								value={selectedUniversity}
								onValueChange={setSelectedUniversity}
							>
								<SelectTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
									<SelectValue placeholder="Select a university" />
								</SelectTrigger>
								<SelectContent>
									{universitiesList.map((university) => (
										<SelectItem
											key={university.id}
											value={university.id}
											className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
										>
											<div className="flex items-center">
												<University className="h-4 w-4" />
												<div className="text-left ml-3">
													<div className="font-medium">{university.name}</div>
													<div className="text-xs text-gray-500">
														{university.country}
													</div>
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount" className="text-gray-900 dark:text-white">
								Amount (USDC) *
							</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="amount"
									type="number"
									placeholder="0.00"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="pl-9 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
									min="0"
									step="0.01"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="invoiceRef"
								className="text-gray-900 dark:text-white"
							>
								Invoice Reference *
							</Label>
							<div className="relative">
								<FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="invoiceRef"
									placeholder="e.g., INV-2024-001"
									value={invoiceRef}
									onChange={(e) => setInvoiceRef(e.target.value)}
									className="pl-9 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
								/>
							</div>
						</div>

						{/* <div className="space-y-2">
							<Label
								htmlFor="description"
								className="text-gray-900 dark:text-white"
							>
								Description (Optional)
							</Label>
							<Textarea
								id="description"
								placeholder="Additional notes about this payment..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
							/>
						</div> */}

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
							disabled={
								isLoading || !selectedUniversity || !amount || !invoiceRef
							}
						>
							{isLoading
								? "Processing..."
								: `Pay ${amount ? `${amount} USDC` : "Amount"}`}
						</Button>
					</form>
				</CardContent>
			</Card>

			<div className="space-y-6">
				{selectedUniversityData && (
					<Card className="border border-gray-200 dark:border-gray-700 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
						<CardHeader>
							<CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
								<University className="h-5 w-5" />
								<span>University Details</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
										Name
									</Label>
									<p className="font-medium text-gray-900 dark:text-white">
										{selectedUniversityData.name}
									</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
										Country
									</Label>
									<p className="text-gray-900 dark:text-white">
										{selectedUniversityData.country}
									</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
										Wallet Address
									</Label>
									<p className="font-mono text-sm break-all bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-900 dark:text-white">
										{selectedUniversityData.address}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				<HowItWorks />
			</div>
		</div>
	);
};
